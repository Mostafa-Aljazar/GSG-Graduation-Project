'use server';

import { AqsaAPI } from '@/services/api';
import { IDelegatesIdsResponse } from '@/types/actor/general/delegates/delegatesResponse.type';
import { fakeDelegatesIdsResponse } from '@/content/actor/delegate/fake-data/fake-delegates';

const USE_FAKE = true;

export const getDelegatesIds = async (): Promise<IDelegatesIdsResponse> => {
    if (USE_FAKE) {
        const fakeData: IDelegatesIdsResponse = fakeDelegatesIdsResponse();
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDelegatesIdsResponse>('/delegates/ids');

        if (response.data?.delegatesIds) {
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
            delegatesIds: [],
            error: errorMessage,
        };
    }
};
