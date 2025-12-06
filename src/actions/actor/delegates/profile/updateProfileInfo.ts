'use server';

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";
import { TDelegateProfileFormValues } from "@/validations/actor/delegates/profile/delegate-profile.schema";

export interface IUpdateDelegateProfileProps {
  delegateId: number;
  payload: TDelegateProfileFormValues;
}

const USE_FAKE = true;

export const updateDelegateProfile = async ({
  delegateId,
  payload,
}: IUpdateDelegateProfileProps): Promise<IActionResponse> => {
  const preparedPayload: TDelegateProfileFormValues = {
    ...payload,
    id: delegateId,
    mobileNumber: payload.mobileNumber as string,
    alternativeMobileNumber: payload.alternativeMobileNumber || '',
    profileImage: payload.profileImage as string,
    numberOfResponsibleCamps: payload.numberOfResponsibleCamps || 0,
    numberOfFamilies: payload.numberOfFamilies || 0,
  };

  if (USE_FAKE) {
    const fakeData: IActionResponse = {
      status: 200,
      message: 'تم تحديث الملف الشخصي بنجاح',
      error: undefined,
    };

    return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.put<IActionResponse>(
      `/delegates/${delegateId}/profile`,
      preparedPayload
    );

    if (response.data) return response.data;

    throw new Error("فشل في تحديث الملف الشخصي");
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
