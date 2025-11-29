'use server';

import { DelegateProfileResponse } from '@/types/delegate/profile/delegate-profile-response.type';
import { DelegateProfileSchemaType } from '@/validations/actor/delegate/delegate-profile-schema';

export interface UpdateDelegateProfileProps {
  delegate_Id: number;
  payload: DelegateProfileSchemaType;
}

export const updateDelegateProfile = async ({
  delegate_Id,
  payload,
}: UpdateDelegateProfileProps): Promise<DelegateProfileResponse> => {
  const fakeResponse: DelegateProfileResponse = {
    status: 200,
    message: 'تم تحديث الملف الشخصي بنجاح',
    user: {
      ...payload,
      id: delegate_Id, //FIXME:
      phone_number: payload.phone_number as string,
      alternative_phone_number: payload.alternative_phone_number as string,
      profile_image: payload.profile_image as string,
    },
  };
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, 500);
  });

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  // try {

  //     const response = await AqsaAPI.put<DelegateProfileResponse>(`/delegates/${delegate_Id}/profile`, payload);

  //     if (response.data?.user) {
  //         return response.data
  //     }

  //     throw new Error("فشل في تحديث الملف الشخصي");

  // } catch (error: any) {

  //     const errorMessage = error.response?.data?.error || error.message || "bbbbحدث خطأ أثناء تحديث الملف الشخصي";

  //     return {
  //         status: error.response?.status || 500,
  //         message: errorMessage,
  //         user: {} as DelegateProfile,
  //         error: errorMessage,
  //     };

  // }
};
