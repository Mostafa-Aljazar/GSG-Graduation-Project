'use server';

import { INotificationsResponse } from '@/types/actor/general/notification/notification-response.type';
import { TUserType } from '@/constants/user-types';
import { fakeNotificationsResponse } from '@/content/actor/notifications/fake-notifications';
import { AqsaAPI } from '@/services/api';

export interface IGetNotificationsProps {
  actorId: string;
  role: TUserType;
  page?: number;
  limit?: number;
}

const USE_FAKE = true;

export const getNotifications = async ({
  page = 1,
  limit = 7,
  actorId,
  role,
}: IGetNotificationsProps): Promise<INotificationsResponse> => {
  if (USE_FAKE) {
    const fakeData: INotificationsResponse = fakeNotificationsResponse({
      page,
      limit,
      actorId,
      role,
    });

    return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.get<INotificationsResponse>('/notifications', {
      params: { page, limit, actorId, role },
    });

    if (response.data?.notifications) {
      return response.data;
    }

    throw new Error('بيانات الاشعارات غير متوفرة');
  } catch (err: unknown) {
    let errorMessage = 'حدث خطأ أثناء جلب الاشعارات';
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      notifications: [],
      pagination: {
        page: 1,
        limit: 0,
        totalItems: 0,
        totalPages: 0,
      },
      error: errorMessage,
    };
  }
};
