"use server";

import { ISecurityProfile, ISecurityProfileResponse } from "@/types/actor/security/profile/security-profile-response.type";
import { AqsaAPI } from "@/services/api";
import { fakeSecurityProfileResponse } from "@/content/actor/security/fake-data/fake-security-profile";

export interface IGetSecurityProfileProps {
    securityId: string;
}

const USE_FAKE = true;

export const getSecurityProfile = async ({
    securityId,
}: IGetSecurityProfileProps): Promise<ISecurityProfileResponse> => {

    if (USE_FAKE) {
        const fakeData = fakeSecurityProfileResponse({ securityId });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }


    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<ISecurityProfileResponse>(
            `/securities/${securityId}/profile`
        );

        if (response.data?.user) return response.data;

        throw new Error("فشل في تحميل بيانات فرد الأمن");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تحميل بيانات فرد الأمن";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            user: {} as ISecurityProfile,
            error: errorMessage,
        };
    }
};
