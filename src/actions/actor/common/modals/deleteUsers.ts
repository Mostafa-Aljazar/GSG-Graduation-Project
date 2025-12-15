'use server';

import { USER_ENDPOINTS, USER_RANK_LABELS, USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IDeleteUsersProps {
    userIds: string[];
    userType: USER_TYPE;
}

const USE_FAKE = false;

export const deleteUsers = async ({
    userIds,
    userType,
}: IDeleteUsersProps): Promise<IActionResponse> => {
    // Fake Mode
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم حذف ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {//src\app\api\actor\displaceds\delete\route.ts
        const endpoint = `${USER_ENDPOINTS[userType]}/delete`;

        const response = await AqsaAPI.delete<IActionResponse>(endpoint,
            { data: { userIds } }
        );
        console.log("🚀 ~ deleteUsers ~ response:", response)

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم حذف ${userIds.length} ${USER_RANK_LABELS[userType]} بنجاح`,
            };
        }

        return {
            status: response.status,
            message: `حدث خطأ أثناء حذف ${USER_RANK_LABELS[userType]}`,
            error: response.data?.error || "خطأ غير متوقع",
        };
    } catch (err: any) {
        console.log("🚀 ~ deleteUsers ~ err:", err);

        const errorMessage = `حدث خطأ أثناء حذف ${USER_RANK_LABELS[userType]}`;
        const errorDetail: string | undefined = err.response?.data?.error;

        return {
            status: 500,
            message: errorMessage,
            error: errorDetail,
        };
    }
};