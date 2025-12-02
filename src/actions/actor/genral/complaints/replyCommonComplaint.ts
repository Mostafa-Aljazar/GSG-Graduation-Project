"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { USER_RANK, TUserRank } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IReplyCommonComplaintProps {
    complaint_Id: number;
    actor_Id: number;
    role: Exclude<TUserRank, typeof USER_RANK.SECURITY_PERSON | typeof USER_RANK.DISPLACED>;
    reply: string;
}

export const replyCommonComplaint = async ({
    complaint_Id,
    actor_Id,
    role,
    reply,
}: IReplyCommonComplaintProps): Promise<IActionResponse> => {

    const fakeResponse: IActionResponse = {
        status: 200,
        message: `تم ارسال الرد بنجاح`,

    }
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeResponse);
        }, 500);
    });

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>(`/complaints/${complaint_Id}/reply`, {
            actor_Id,
            role,
            reply,
        });

        if (response.data) {
            return response.data
        }

        throw new Error("حدث خطأ أثناء ارسال الرد");

    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error || error.message || "حدث خطأ أثناء ارسال الرد";
        return {
            status: error.response?.status || 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};