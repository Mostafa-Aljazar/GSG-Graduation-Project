'use server';

import { IActionResponse } from '@/types/common/action-response.type';
import { TUserRank, TUserType } from '@/constants/user-types';
import { AqsaAPI } from '@/services/api';

export interface IDeleteCommonComplaintProps {
  complaint_Id: number;
  actor_Id: number;
  role: TUserType | TUserRank;
}

export const deleteCommonComplaint = async ({
  complaint_Id,
  actor_Id,
  role,
}: IDeleteCommonComplaintProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: `تم حذف الشكوى بنجاح`,
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
    const response = await AqsaAPI.delete<IActionResponse>(`/complaints/${complaint_Id}`, {
      data: {
        actor_Id,
        role,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error('حدث خطأ أثناء حذف الشكوى');
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ أثناء حذف الشكوى';
    return {
      status: error.response?.status || 500,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
