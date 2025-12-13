"use server";

import { TSecurityProfileFormValues } from "@/validations/actor/securities/profile/security-profile.schema";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IAddNewSecurityProps {
    payload: TSecurityProfileFormValues;
}

const USE_FAKE = false;

export const addNewSecurity = async ({
    payload,
}: IAddNewSecurityProps): Promise<IActionResponse> => {

    const preparedPayload: TSecurityProfileFormValues = payload;

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 201,
            message: "تم إضافة فرد الأمن بنجاح",
            error: undefined,
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        // src\app\api\actor\securities\add
        const response = await AqsaAPI.post<IActionResponse>("/actor/securities/add", preparedPayload);
        console.log("🚀 ~ addNewSecurity ~ response:", response)

        if (response.data) {
            return response.data;
        }

        throw new Error("فشل في إضافة فرد الأمن");

    } catch (err: unknown) {

        let errorMessage = "حدث خطأ أثناء إضافة فرد الأمن";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
