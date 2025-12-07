"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IReplyComplaintProps {
    actorId: number;
    complaintId: number;
    role: USER_RANK.SECURITY_OFFICER | USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
    reply: string;
}

const USE_FAKE = true;

export const replyComplaint = async ({
    actorId,
    complaintId,
    role,
    reply,
}: IReplyComplaintProps): Promise<IActionResponse> => {
    const fakeResponse: IActionResponse = {
        status: 200,
        message: "تم ارسال الرد بنجاح",
    };

    if (USE_FAKE) {
        return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>(`/complaints/${complaintId}/reply`, {
            actorId,
            role,
            reply,
        });

        if (response.data) return response.data;

        throw new Error("حدث خطأ أثناء ارسال الرد");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء ارسال الرد";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
