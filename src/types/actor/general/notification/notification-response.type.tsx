import { TUserType } from '@/constants/user-types';
import { NotificationActions, NotificationStatus, TYPE_AIDS } from '../../common/index.type';
import { IPagination } from '@/types/common/pagination.type';

export interface INotificationType {
  action: NotificationActions;
  aidType?: TYPE_AIDS;
}

export interface INotificationItem {
  id: string;
  dateTime: Date | string;
  title: string;
  body: string;
  status: NotificationStatus;
  notificationType: INotificationType;
  from: {
    id: string;
    name: string;
    role: TUserType;
  };
}

export interface INotificationsResponse {
  status: number;
  message?: string;
  notifications: INotificationItem[];
  error?: string;
  pagination: IPagination;
}
