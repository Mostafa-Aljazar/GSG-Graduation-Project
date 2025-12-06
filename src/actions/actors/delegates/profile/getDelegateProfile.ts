'use server';

import { fakeDelegateProfileResponse } from '@/content/actor/delegate/delegate-profile';
import { DelegateProfileResponse } from '@/types/delegate/profile/delegate-profile-response.type';

export interface getDelegateProfileProps {
  delegate_Id: number;
}

export const getDelegateProfile = async ({
  delegate_Id,
}: getDelegateProfileProps): Promise<DelegateProfileResponse> => {
  const fakeData = fakeDelegateProfileResponse({ delegate_Id });

  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 500);
  });

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  // try {
  //     const response = await AqsaAPI.get<DelegateProfileResponse>(`/delegates/${delegate_Id}/profile`);

  //     if (response.data?.user) {
  //         return response.data
  //     }

  //     throw new Error("فشل في تحميل بيانات الملف الشخصي");

  // } catch (error: any) {
  //     const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء تحميل الملف الشخصي";
  //     return {
  //         status: error.response?.status || 500,
  //         message: errorMessage,
  //         user: {} as DelegateProfile,
  //         error: errorMessage,
  //     };
  // }
};
