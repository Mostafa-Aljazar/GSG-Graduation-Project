'use server';

import { AqsaGuestAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IForgetPasswordProps {
    email: string;
}

const USE_FAKE = true;

export const forgetPassword = async ({
    email,
}: IForgetPasswordProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaGuestAPI.post("/auth/forget-password", { email });

        if (!response.data || response.status !== 200) {
            throw new Error("حدث خطأ في إرسال رمز التحقق");
        }

        return {
            status: 200,
            message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        };

    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "حدث خطأ في إرسال رمز التحقق";

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
