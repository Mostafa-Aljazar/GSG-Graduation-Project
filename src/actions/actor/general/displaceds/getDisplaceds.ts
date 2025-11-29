'use server';

import { fakeDisplacedResponse } from "@/content/actor/displaced/fake-data/fake-displaced";
import { AqsaAPI } from "@/services/api";
import { IDisplacedsResponse } from "@/types/actor/general/displaceds/displacesResponse.type";
import { TDisplacedsFilterFormValues } from "@/validations/actor/general/displaceds/displaceds-filter-form";


export interface IGetDisplacedsProps {
    page?: number;
    limit?: number;
    search?: string;
    filters?: TDisplacedsFilterFormValues;
}

const USE_FAKE = true;

export const getDisplaceds = async ({
    page = 1,
    limit = 7,
    search = '',
    filters,
}: IGetDisplacedsProps): Promise<IDisplacedsResponse> => {

    if (USE_FAKE) {
        const fakeData: IDisplacedsResponse = fakeDisplacedResponse({ page, limit, search, filters });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDisplacedsResponse>("/displaceds", {
            params: {
                page,
                limit,
                search,
                filters,
            }
        });

        if (response.data?.displaceds) {
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
            displaceds: [],
            pagination: {
                page: 1,
                limit: 0,
                totalItems: 0,
                totalPages: 0,
            },
            error: errorMessage,
        };
    }
};
