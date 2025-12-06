"use server";

import { TDisplacedProfileFormValues } from "@/validations/actor/displaceds/profile/displaced-profile.schema";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";
import { AGES } from "@/types/actor/common/index.type";

export interface IUpdateDisplacedProfileProps {
    displacedId: number;
    payload: TDisplacedProfileFormValues;
}

const USE_FAKE = true;

export const updateDisplacedProfile = async ({
    displacedId,
    payload,
}: IUpdateDisplacedProfileProps): Promise<IActionResponse> => {
    const preparedPayload = {
        ...payload,
        additionalNotes: payload.additionalNotes || "",
        profileImage: payload.profileImage as string,
        alternativeMobileNumber: payload.alternativeMobileNumber || "",
        socialStatus: {
            ...payload.socialStatus,
            ageGroups: Object.fromEntries(
                Object.values(AGES).map((age) => [
                    age,
                    payload.socialStatus.ageGroups?.[age as keyof typeof payload.socialStatus.ageGroups] ?? 0,
                ])
            ) as Record<string, number>,
        },
        displacement: {
            tentNumber: payload.displacement.tentNumber,
            tentType: payload.displacement.tentType,
            familyStatusType: payload.displacement.familyStatusType,
            displacementDate: payload.displacement.displacementDate,
            delegate: payload.displacement.delegate,
        },
    };

    if (USE_FAKE) {
        const fakeData: IActionResponse = {
            status: 200,
            message: "تم تحديث الملف الشخصي للنازح بنجاح",
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.put<IActionResponse>(
            `/displaceds/${displacedId}/profile`,
            preparedPayload
        );

        if (response.data) {
            return response.data;
        }

        throw new Error("فشل في تحديث الملف الشخصي");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تحديث الملف الشخصي للنازح";
        const statusCode = 500;

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
