'use server';

import { IActionResponse } from '@/types/common/action-response.type';
import { USER_RANK, USER_TYPE, TUserRank, TUserType } from '@/constants/user-types';
import { AqsaAPI } from '@/services/api';

export interface IChangeStatusCommonComplaintProps {
  complaint_Id: number;
  actor_Id: number;
  role: Exclude<TUserRank, typeof USER_RANK.SECURITY_PERSON | typeof USER_RANK.DISPLACED>;
}

export const changeStatusCommonComplaint = async ({
  complaint_Id,
  actor_Id,
  role,
}: IChangeStatusCommonComplaintProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: `تم تغيير حالة الشكوى بنجاح`,
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
    const response = await AqsaAPI.put<IActionResponse>(
      `/complaints/${complaint_Id}/change-status`,
      {
        actor_Id,
        role,
      }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('حدث خطأ أثناء تغيير حالة الشكوى');
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'حدث خطأ أثناء تغيير حالة الشكوى';
    return {
      status: error.response?.status || 500,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
