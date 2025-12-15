'use server';

import { USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import { AqsaAPI } from '@/services/api';
import { IActionResponse } from '@/types/common/action-response.type';

const USE_FAKE = false;

export interface ISendUsersActionRequestProps {
    userIds: string[];
    userType: USER_TYPE;
    dateTime: Date;
    details: string;
    action: 'CALL' | 'MEETING'; // نوع الإجراء لتحديد endpoint والرسائل
}

export const sendUsersActionRequest = async ({
    userIds,
    userType,
    dateTime,
    details,
    action,
}: ISendUsersActionRequestProps): Promise<IActionResponse> => {
    const actionLabel = action === 'CALL' ? 'استدعاء' : 'طلب الاجتماع';
    // const endpoint = `${USER_ENDPOINTS[userType]}/${action}`;

    // Fake Mode
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم إنشاء ${actionLabel} لـ ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        //src\app\api\actor\common\modals\call-meet
        const response = await AqsaAPI.post<IActionResponse>("/actor/common/modals/call-meet", {
            userIds,
            dateTime,
            details,
            action
        });
        console.log("🚀 ~ sendUsersActionRequest ~ response:", response)

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم إنشاء ${actionLabel} لـ ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
            };
        }

        return {
            status: response.status,
            message: `حدث خطأ أثناء إنشاء ${actionLabel} ${USER_RANK_LABELS[userType]}`,
            error: response.data?.error || 'خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = `حدث خطأ أثناء إنشاء ${actionLabel} ${USER_RANK_LABELS[userType]}`;
        if (err instanceof Error) errorMessage = err.message;

        return {
            status: 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
