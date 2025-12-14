'use server';

import { INotificationsResponse } from '@/types/actor/general/notification/notification-response.type';
import { TUserType } from '@/constants/user-types';
import { fakeNotificationsResponse } from '@/content/actor/notifications/fake-notifications';
import { AqsaAPI } from '@/services/api';

export interface IgetNotificationsProps {
  actor_Id: number;
  role: TUserType;
  page: number;
  limit: number;
}

export const getNotifications = async ({
  page = 1,
  limit = 7,
  actor_Id,
  role,
}: IgetNotificationsProps): Promise<INotificationsResponse> => {
  const fakeResponse = fakeNotificationsResponse({ page, limit, actor_Id, role });
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, 500);
  });


  
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  try {
    const response = await AqsaAPI.get<INotificationsResponse>('/notifications', {
      params: { page, limit, actor_Id, role },
    });

    if (response.data?.notifications) {
      return {
        status: 200,
        message: 'تم جلب الاشعارات بنجاح',
        notifications: response.data.notifications,
        pagination: response.data.pagination,
      };
    }

    throw new Error('بيانات الاشعارات غير متوفرة');
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'حدث خطأ أثناء جلب الاشعارات';
    return {
      status: error.response?.status || 500,
      message: errorMessage,
      notifications: [],
      pagination: {
        page: 1,
        limit: 0,
        total_items: 0,
        total_pages: 0,
      },
      error: errorMessage,
    };
  }
};
