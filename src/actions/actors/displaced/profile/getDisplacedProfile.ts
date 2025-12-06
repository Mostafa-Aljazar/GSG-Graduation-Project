"use server";

import { fakeDisplacedProfileResponse } from "@/content/actor/displaced/displaced-profile";
import { DisplacedProfileResponse } from "@/types/displaced/profile/displaced-profile.type";


export interface getDisplacedProfileProps {
    displaced_Id: number;
};

export const getDisplacedProfile = async ({ displaced_Id }: getDisplacedProfileProps): Promise<DisplacedProfileResponse> => {

    const fakeResponse: DisplacedProfileResponse = fakeDisplacedProfileResponse({ displaced_Id: displaced_Id })

    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeResponse);
        }, 500);
    });

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    // try {
    //     const response = await AqsaAPI.get<DisplacedProfileResponse>(`/displaceds/${displaced_Id}/profile`);

    //     if (response.data?.user) {
    //         return response.data
    //     }

    //     throw new Error("فشل في تحميل بيانات الملف الشخصي");

    // } catch (error: any) {
    //     const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء تحميل الملف الشخصي";
    //     return {
    //         status: error.response?.status || 500,
    //         message: errorMessage,
    //         user: {} as DisplacedProfile,
    //         error: errorMessage,
    //     };
    // }
};