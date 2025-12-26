"use server";

import { fakeDisplacedProfileResponse } from "@/content/actor/displaceds/fake-data/fake-displaced-profile";
import { IDisplacedProfileResponse } from "@/types/actor/displaceds/profile/displaced-profile.type";
import { AqsaAPI } from "@/services/api";

export interface IGetDisplacedProfileProps {
    displacedId: string;
}

const USE_FAKE = false;

export const getDisplacedProfile = async ({
    displacedId,
}: IGetDisplacedProfileProps): Promise<IDisplacedProfileResponse> => {
    if (USE_FAKE) {
        const fakeData = fakeDisplacedProfileResponse({ displacedId });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDisplacedProfileResponse>(
            `/actor/displaceds/${displacedId}/profile`
        );

        if (response.data?.user) return response.data;

        throw new Error("فشل في تحميل بيانات الملف الشخصي");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تحميل الملف الشخصي";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            user: {} as any,
            error: errorMessage,
        };
    }
};
