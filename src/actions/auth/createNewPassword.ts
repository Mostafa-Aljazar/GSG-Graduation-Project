"use server";

import { AqsaGuestAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface ICreateNewPasswordProps {
    email: string
    password: string;
    confirmPassword: string;
}

const USE_FAKE = false;

export const createNewPassword = async ({ email, password, confirmPassword }: ICreateNewPasswordProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم تحديث كلمة المرور بنجاح"
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {

        const response = await AqsaGuestAPI.post<IActionResponse>("/auth/create-new-password", {
            password,
            confirmPassword,
            email
        });

        if (!response.data || response.status !== 200) {
            throw new Error("حدث خطأ في إرسال رمز التحقق");
        }

        return {
            status: 200,
            message: "تم تحديث كلمة المرور بنجاح"
        };

    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "فشل في تحديث كلمة المرور";

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
}
