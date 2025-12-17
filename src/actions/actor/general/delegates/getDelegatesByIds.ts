'use server';

import { AqsaAPI } from '@/services/api';
import { IDelegatesResponse } from '@/types/actor/general/delegates/delegates-response.type';
import { fakeDelegatesByIdsResponse } from '@/content/actor/delegates/fake-data/fake-delegates';

export interface IGetDelegatesByIdsProps {
    Ids: string[];
    page?: number;
    limit?: number;
}

const USE_FAKE = false;

export const getDelegatesByIds = async ({
    Ids,
    page = 1,
    limit = 7,
}: IGetDelegatesByIdsProps): Promise<IDelegatesResponse> => {
    if (USE_FAKE) {
        const fakeData: IDelegatesResponse = fakeDelegatesByIdsResponse({ Ids, page, limit });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }
    console.log("🚀 ~ Ids:", Ids)


    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDelegatesResponse>('/actor/delegates/by-ids', {
            params: { ids: Ids, page, limit },
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
