'use server';

import { AqsaAPI } from '@/services/api';
import { IActionResponse } from '@/types/common/action-response.type';

export interface ISendUpdateDelegatesRequestProps {
    delegateIds: number[];
}

const USE_FAKE = true;

export const sendUpdateDelegatesRequest = async ({
    delegateIds,
}: ISendUpdateDelegatesRequestProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم ارسال طلب تحديث لـ ${delegateIds.length} مندوب بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>('/delegates/update', {
            delegateIds,
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم ارسال طلب تحديث لـ ${delegateIds.length} مندوب بنجاح`,
            };
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء ارسال طلب تحديث البيانات',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء ارسال طلب تحديث البيانات';
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
