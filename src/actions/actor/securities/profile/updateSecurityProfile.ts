"use server";

import { TSecurityProfileFormValues } from "@/validations/actor/securities/profile/security-profile.schema";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IUpdateSecurityProfileProps {
    securityId: string;
    payload: TSecurityProfileFormValues;
}

const USE_FAKE = true;

export const updateSecurityProfile = async ({
    securityId,
    payload,
}: IUpdateSecurityProfileProps): Promise<IActionResponse> => {
    const preparedPayload: TSecurityProfileFormValues = payload;

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم تحديث بيانات فرد الأمن بنجاح",
            error: undefined,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.put<IActionResponse>(
            `/securities/${securityId}/profile`,
            preparedPayload
        );

        if (response.data) {
            return response.data;
        }

        throw new Error("فشل في تحديث بيانات فرد الأمن");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تحديث بيانات فرد الأمن";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
