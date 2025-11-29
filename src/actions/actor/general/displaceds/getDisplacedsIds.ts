"use server";

import { fakeDisplacedIdsResponse } from "@/content/actor/displaced/fake-data/fake-displaced";
import { AqsaAPI } from "@/services/api";
import { IDisplacedsIdsResponse } from "@/types/actor/general/displaceds/displacesResponse.type";
import { TDisplacedsFilterFormValues } from "@/validations/actor/general/displaceds/displaceds-filter-form";

export interface IGetDisplacedsIdsProps {
    filters: TDisplacedsFilterFormValues;
}

const USE_FAKE = true;

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
            "/displaceds/ids",
            {
                params: { filters },
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
