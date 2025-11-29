'use server';

import { AqsaAPI } from '@/services/api';
import { IActionResponse } from '@/types/common/action-response.type';

export interface ISendMeetingDelegateRequestProps {
    delegateIds: number[];
    dateTime: Date;
    details: string;
}

const USE_FAKE = true;

export const sendMeetingDelegateRequest = async ({
    delegateIds,
    dateTime,
    details,
}: ISendMeetingDelegateRequestProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم ارسال طلب الاجتماع لـ ${delegateIds.length} مندوب بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>('/delegates/meeting', {
            delegateIds,
            dateTime,
            details,
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم ارسال طلب الاجتماع لـ ${delegateIds.length} مندوب بنجاح`,
            };
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء ارسال طلب الاجتماع',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء ارسال طلب الاجتماع';
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
