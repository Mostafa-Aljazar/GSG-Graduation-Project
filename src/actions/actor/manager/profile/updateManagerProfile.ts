'use server';

import { AqsaAPI } from "@/services/api";
import { USER_RANK } from "@/constants/user-types";
import {
  TManagerProfileFormValues,
} from "@/validations/actor/manager/profile/manager-profile-Schema";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IUpdateManagerProfileProps {
  managerId: string;
  payload: TManagerProfileFormValues;
}

const USE_FAKE = true;

export const updateManagerProfile = async ({
  managerId,
  payload,
}: IUpdateManagerProfileProps): Promise<IActionResponse> => {
  const preparedPayload = {
    ...payload,
    id: managerId,
    profileImage: payload.profileImage || '',
    alternativeMobileNumber: payload.alternativeMobileNumber || '',
    role: USER_RANK.MANAGER,
    rank: USER_RANK.MANAGER,
  };

  if (USE_FAKE) {
    const fakeData: IActionResponse = {
      status: 200,
      message: "تم تحديث الملف الشخصي للمدير بنجاح",
      error: undefined,
    };

    return new Promise((resolve) =>
      setTimeout(() => resolve(fakeData), 500)
    );
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.put<IActionResponse>(
      `/manager/${managerId}/profile`,
      preparedPayload
    );

    if (response.data) return response.data;

    throw new Error("فشل في تحديث بيانات الملف الشخصي");
  } catch (err: unknown) {
    let errorMessage = "حدث خطأ أثناء تحديث الملف الشخصي";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
