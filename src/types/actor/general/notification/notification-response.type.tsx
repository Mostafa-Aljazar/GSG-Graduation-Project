import { TUserType } from '@/constants/user-types';
import { TYPE_AIDS } from '../../common/index.type';

export type TNotificationAction =
  | 'change_delegate'
  | 'edit'
  | 'delete'
  | 'call'
  | 'update'
  | 'meeting'
  | 'add-aid'
  | 'another-notification';

export interface NotificationType {
  action: TNotificationAction;
  aid_type?: TYPE_AIDS;
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export interface INotificationItem {
  id: number;
  dateTime: Date;
  title: string;
  body: string;
  status: NotificationStatus;
  notification_type: NotificationType;
  from: {
    id: number;
    name: string;
    role: TUserType;
  };
}

export interface INotificationsResponse {
  status: number;
  message?: string;
  notifications: INotificationItem[];
  error?: string;
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}
