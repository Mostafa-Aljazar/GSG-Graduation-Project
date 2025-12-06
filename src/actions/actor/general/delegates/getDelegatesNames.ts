'use server';

import { fakeDelegatesNamesResponse } from '@/content/actor/delegates/fake-data/fake-delegates';
import { AqsaAPI } from '@/services/api';
import { IDelegatesNamesResponse } from '@/types/actor/general/delegates/delegates-response.type';

export interface IGetDelegatesNamesProps {
    ids?: number[];
}

const USE_FAKE = true;

export const getDelegatesNames = async ({
    ids,
}: IGetDelegatesNamesProps): Promise<IDelegatesNamesResponse> => {
    if (USE_FAKE) {
        const fakeData: IDelegatesNamesResponse = fakeDelegatesNamesResponse({ ids });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDelegatesNamesResponse>(
            '/delegates/names',
            { params: { ids } }
        );

        if (response.data?.delegateNames) {
            return response.data;
        }

        throw new Error('فشل في تحميل بيانات المناديب');
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء تحميل بيانات المناديب';
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            delegateNames: [],
            error: errorMessage,
        };
    }
};
