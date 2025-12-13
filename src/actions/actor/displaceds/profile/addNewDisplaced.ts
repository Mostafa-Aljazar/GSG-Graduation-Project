"use server";

import { USER_TYPE, USER_RANK } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { AGES } from "@/types/actor/common/index.type";
import { IDisplacedProfile } from "@/types/actor/displaceds/profile/displaced-profile.type";
import { IActionResponse } from "@/types/common/action-response.type";
import { TDisplacedProfileFormValues } from "@/validations/actor/displaceds/profile/displaced-profile.schema";

export interface IAddNewDisplacedProps {
  payload: TDisplacedProfileFormValues;
}

const USE_FAKE = false;

export const addNewDisplaced = async ({
  payload,
}: IAddNewDisplacedProps): Promise<IActionResponse> => {
  const preparedPayload: IDisplacedProfile = {
    ...payload,
    role: USER_TYPE.DISPLACED,
    rank: USER_RANK.DISPLACED,
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
    displacement: payload.displacement,
  };
  console.log("🚀 ~ addNewDisplaced ~ preparedPayload:", preparedPayload)

  if (USE_FAKE) {
    const fakeData: IActionResponse = {
      status: 201,
      message: "تم إضافة النازح الجديد بنجاح",
      // user: preparedPayload,
      error: undefined,
    };

    return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.post<IActionResponse>("/actor/displaceds/add", preparedPayload);

    if (response.data) {
      return response.data;
    }

    throw new Error("فشل في إضافة النازح الجديد");
  } catch (err: unknown) {
    let errorMessage = "حدث خطأ أثناء إضافة النازح الجديد";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
