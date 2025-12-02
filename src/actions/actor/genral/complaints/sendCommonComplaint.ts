'use server';

import { IActionResponse } from '@/types/common/action-response.type';
import { USER_RANK, TUserRank } from '@/constants/user-types';
import { AqsaAPI } from '@/services/api';

export interface ISendCommonComplaintProps {
  actor_Id: number;
  role: Exclude<(typeof USER_RANK)[TUserRank], typeof USER_RANK.MANAGER>;
  reception: Exclude<
    (typeof USER_RANK)[TUserRank],
    typeof USER_RANK.DISPLACED | typeof USER_RANK.SECURITY_PERSON
  >;
  title: string;
  content: string;
}

export const sendCommonComplaint = async ({
  actor_Id,
  role,
  reception,
  title,
  content,
}: ISendCommonComplaintProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: `تم ارسال الشكوي بنجاح`,
  };
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, 500);
  });

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.post<IActionResponse>('/complaints/send-complaint', {
      actor_Id,
      role,
      reception,
      title,
      content,
    });

    if (response.data) {
      return response.data;
    }

    throw new Error('حدث خطأ أثناء ارسال الشكوى');
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'حدث خطأ أثناء ارسال الشكوي';
    return {
      status: error.response?.status || 500,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
