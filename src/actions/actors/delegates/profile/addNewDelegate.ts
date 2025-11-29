'use server';

import { DelegateProfileResponse } from '@/types/delegate/profile/delegate-profile-response.type';
import { DelegateProfileSchemaType } from '@/validations/actor/delegate/delegate-profile-schema';
// import {DelegateProfileResponse} from '@/types/'

export interface addNewDelegateProps {
  payload: DelegateProfileSchemaType;
}

export const addNewDelegate = async ({
  payload,
}: addNewDelegateProps): Promise<DelegateProfileResponse> => {
  const fakeResponse: DelegateProfileResponse = {
    status: 201, // 201 Created
    message: 'تم إضافة المندوب الجديد بنجاح',
    user: {
      ...payload,
      phone_number: payload.phone_number as string,
      alternative_phone_number: payload.alternative_phone_number as string,
      profile_image: payload.profile_image as string,
      number_of_responsible_camps: 0,
      number_of_families: 0,
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

  //     const response = await AqsaAPI.post<DelegateProfileResponse>("/delegates/add", payload); // Assuming a manager endpoint for adding delegates

  //     if (response.data?.user) {
  //         return response.data
  //     }

  //     throw new Error("فشل في إضافة المندوب الجديد");

  // } catch (error: any) {

  //     const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء إضافة المندوب الجديد";

  //     return {
  //         status: error.response?.status || 500,
  //         message: errorMessage,
  //         user: {} as DelegateProfile,
  //         error: errorMessage,
  //     };

  // }
};
