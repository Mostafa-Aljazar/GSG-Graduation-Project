'use server';

import { AqsaGuestAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IForgetPasswordProps {
    email: string;
}

export const forgetPassword = async ({
    email,
}: IForgetPasswordProps): Promise<IActionResponse> => {
    try {
        const { data } = await AqsaGuestAPI.post("/auth/forget-password", {
            email,
        });

        return {
            status: data.status,
            message: data.message,
        };
    } catch (err: any) {
        const status = err.response?.status || 500;
        const message =
            err.response?.data?.message ||
            "حدث خطأ في إرسال رمز التحقق";

        return {
            status,
            message,
            error: message,
        };
    }
};
