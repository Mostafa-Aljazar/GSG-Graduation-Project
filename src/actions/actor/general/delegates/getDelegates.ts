'use server';

import { fakeDelegatesResponse } from "@/content/actor/delegate/fake-data/fake-delegates";
import { AqsaAPI } from "@/services/api";
import { IDelegatesResponse } from "@/types/actor/general/delegates/delegatesResponse.type";


export interface IGetDelegatesProps {
    page?: number;
    limit?: number;
}

const USE_FAKE = true;

export const getDelegates = async ({
    page = 1,
    limit = 15,
}: IGetDelegatesProps): Promise<IDelegatesResponse> => {
    if (USE_FAKE) {
        const fakeData: IDelegatesResponse = fakeDelegatesResponse({ page, limit });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDelegatesResponse>('/delegates', {
            params: { page, limit },
        });

        if (response.data?.delegates) {
            return response.data;
        }

        throw new Error('بيانات المناديب غير متوفرة');
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء جلب بيانات المناديب';
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            delegates: [],
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
