'use server';

import { AqsaAPI } from '@/services/api';
import { IActionResponse } from '@/types/common/action-response.type';

const USE_FAKE = true;

export interface ISendCallDelegatesRequestProps {
    delegateIds: number[];
    dateTime: Date;
    details: string;
}

export const sendCallDelegatesRequest = async ({
    delegateIds,
    dateTime,
    details,
}: ISendCallDelegatesRequestProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم إنشاء استدعاء لـ ${delegateIds.length} مندوب بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>('/delegates/calls', {
            delegateIds,
            dateTime,
            details,
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم إنشاء استدعاء لـ ${delegateIds.length} مندوب بنجاح`,
            };
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء إنشاء الاستدعاء',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء إنشاء الاستدعاء';
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
