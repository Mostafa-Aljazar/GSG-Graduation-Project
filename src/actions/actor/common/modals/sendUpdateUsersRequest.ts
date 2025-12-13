'use server';

import { USER_ENDPOINTS, USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import { AqsaAPI } from '@/services/api';
import { IActionResponse } from '@/types/common/action-response.type';

const USE_FAKE = true;

export interface ISendUpdateUsersRequestProps {
    userIds: string[];
    userType: USER_TYPE;
}

export const sendUpdateUsersRequest = async ({
    userIds,
    userType,
}: ISendUpdateUsersRequestProps): Promise<IActionResponse> => {
    // Fake Mode
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم ارسال طلب تحديث لـ ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const endpoint = `${USER_ENDPOINTS[userType]}/update`;

        const response = await AqsaAPI.post<IActionResponse>(endpoint, {
            userIds,
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم ارسال طلب تحديث لـ ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
            };
        }

        return {
            status: response.status,
            message: `حدث خطأ أثناء ارسال طلب تحديث ${USER_RANK_LABELS[userType]}`,
            error: response.data?.error || 'خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = `حدث خطأ أثناء ارسال طلب تحديث ${USER_RANK_LABELS[userType]}`;
        if (err instanceof Error) errorMessage = err.message;

        return {
            status: 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
