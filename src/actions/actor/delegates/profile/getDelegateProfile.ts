'use server';

import { fakeDelegateProfileResponse } from '@/content/actor/delegates/fake-data/fake-delegate-profile';
import { AqsaAPI } from '@/services/api';
import { IDelegateProfile, IDelegateProfileResponse } from '@/types/actor/delegates/profile/delegate-profile-response.type';

export interface IGetDelegateProfileProps {
  delegateId: string;
}

const USE_FAKE = true;

export const getDelegateProfile = async ({
  delegateId,
}: IGetDelegateProfileProps): Promise<IDelegateProfileResponse> => {
  if (USE_FAKE) {
    const fakeData = fakeDelegateProfileResponse({ delegateId });

    return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.get<IDelegateProfileResponse>(`/delegates/${delegateId}/profile`);

    if (response.data.user) return response.data;

    throw new Error("فشل في تحميل بيانات الملف الشخصي");
  } catch (err: unknown) {
    let errorMessage = "حدث خطأ أثناء تحميل الملف الشخصي";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      user: {} as IDelegateProfile,
      error: errorMessage,
    };
  }
};
