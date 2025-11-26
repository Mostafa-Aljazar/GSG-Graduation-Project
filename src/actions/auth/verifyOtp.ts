'use server';

import { AqsaGuestAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IVerifyOtpProps {
    otp: string;
    email: string;
}

const USE_FAKE = true;

export const verifyOtp = async ({
    email,
    otp,
}: IVerifyOtpProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم التحقق من الرمز بنجاح",
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaGuestAPI.post("/auth/verify-otp", { otp, email });

        if (!response.data || response.status !== 200) {
            throw new Error("رمز التحقق غير صالح");
        }

        return {
            status: 200,
            message: "تم التحقق من الرمز بنجاح",
        };
    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "رمز التحقق غير صالح";

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
