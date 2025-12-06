'use server';

import { fakeManagerProfileResponse } from "@/content/actor/manager/manager-profile";
import { IManagerProfile, IManagerProfileResponse } from "@/types/actor/manager/profile/manager-profile-response.type";
import { AqsaAPI } from "@/services/api";

export interface IGetManagerProfileProps {
    managerId: number;
}

const USE_FAKE = true;

export const getManagerProfile = async ({
    managerId,
}: IGetManagerProfileProps): Promise<IManagerProfileResponse> => {

    if (USE_FAKE) {
        const fakeData = fakeManagerProfileResponse({ managerId });

        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IManagerProfileResponse>(
            `/manager/${managerId}/profile`
        );

        if (response.data.user) return response.data;

        throw new Error("فشل في تحميل بيانات الملف الشخصي");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تحميل الملف الشخصي";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            user: {} as IManagerProfile,
            error: errorMessage,
        };
    }
};
