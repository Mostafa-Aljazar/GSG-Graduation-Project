'use server';

import { USER_TYPE } from '@/constants/user-types';
import { AGES } from '@/types/common/actors-information.type';
import { DisplacedProfileResponse } from '@/types/displaced/profile/displaced-profile.type';
import { DisplacedProfileSchemaType } from '@/validations/actor/displaceds/profile/displaced-profile-schema';

export interface AddNewDisplacedProps {
  payload: DisplacedProfileSchemaType;
}

export const addNewDisplaced = async ({
  payload,
}: AddNewDisplacedProps): Promise<DisplacedProfileResponse> => {
  const fakeResponse: DisplacedProfileResponse = {
    status: 201,
    message: 'تم إضافة النازح الجديد بنجاح',
    user: {
      ...payload,
      role: USER_TYPE.DISPLACED,
      rank: USER_TYPE.DISPLACED,
      additional_notes: payload.additional_notes || '',
      profile_image: payload.profile_image as string,
      alternative_phone_number: payload.alternative_phone_number || '',
      social_status: {
        ...payload.social_status,
        age_groups: Object.fromEntries(
          Object.values(AGES).map((age) => [
            age,
            payload.social_status.age_groups?.[
              age as keyof typeof payload.social_status.age_groups
            ] ?? 0,
          ])
        ) as Record<string, number>,
      },
      displacement: payload?.displacement,
    },
  };
  return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  // try {
  //     const response = await AqsaAPI.post<DisplacedProfileResponse>("/displaceds/add", payload);

  //     if (response.data?.user) {
  //         return response.data
  //     }

  //     throw new Error("فشل في إضافة النازح الجديد");

  // } catch (error: any) {
  //     const errorMessage =
  //         error.response?.data?.error || error.message || "حدث خطأ أثناء إضافة النازح الجديد";
  //     return {
  //         status: error.response?.status || 500,
  //         message: errorMessage,
  //         user: {} as DisplacedProfile,
  //         error: errorMessage,
  //     };
  // }
};
