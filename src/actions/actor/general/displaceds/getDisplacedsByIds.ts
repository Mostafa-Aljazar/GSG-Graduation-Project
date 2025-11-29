"use server";

import { IDisplacedsResponse } from "@/types/actor/general/displaceds/displacesResponse.type";
import { AqsaAPI } from "@/services/api";
import { fakeDisplacedByIdsResponse } from "@/content/actor/displaced/fake-data/fake-displaced";

export interface IGetDisplacedByIdsProps {
    ids: number[];
    page?: number;
    limit?: number;
}

const USE_FAKE = true;

export const getDisplacedByIds = async ({
    ids,
    page = 1,
    limit = 7,
}: IGetDisplacedByIdsProps): Promise<IDisplacedsResponse> => {

    if (USE_FAKE) {
        const fakeData: IDisplacedsResponse = fakeDisplacedByIdsResponse({
            ids,
            page,
            limit,
        });

        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDisplacedsResponse>(
            "/displaceds/by-ids",
            {
                params: {
                    page,
                    limit,
                    ids,
                },
            }
        );

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
