"use server";

import { fakeDisplacedIdsResponse } from "@/content/actor/displaceds/fake-data/fake-displaced";
import { AqsaAPI } from "@/services/api";
import { IDisplacedsIdsResponse } from "@/types/actor/general/displaceds/displaces-response.type";
import { TDisplacedsFilterFormValues } from "@/validations/actor/general/displaceds/displaceds-filter-form.schema";

export interface IGetDisplacedsIdsProps {
    filters: TDisplacedsFilterFormValues;
}

const USE_FAKE = false;

export const getDisplacedsIds = async ({
    filters,
}: IGetDisplacedsIdsProps): Promise<IDisplacedsIdsResponse> => {

    if (USE_FAKE) {
        const fakeData: IDisplacedsIdsResponse = fakeDisplacedIdsResponse({ filters });
        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDisplacedsIdsResponse>(
            "/actor/displaceds/ids",
            {
                params: {
                    filters: JSON.stringify(filters)
                },
            }
        );

        if (response.data?.displacedsIds) {
            return response.data;
        }

        throw new Error("بيانات النازحين غير متوفرة");

    } catch (err: any) {

        let errorMessage = 'حدث خطأ أثناء جلب بيانات النازحين';
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            displacedsIds: [],
            error: errorMessage,
        };
    }
};
