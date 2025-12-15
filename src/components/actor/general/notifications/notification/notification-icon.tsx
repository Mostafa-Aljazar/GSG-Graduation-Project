'use client';

import { PlusCircle } from 'lucide-react';
import { ThemeIcon } from '@mantine/core';
import { INotificationItem } from '@/types/actor/general/notification/notification-response.type';
import {
  NotificationActions,
  Notification_Actions_ICONS,
  TYPE_AIDS,
  getAidsTypes,
} from '@/types/actor/common/index.type';

interface Props {
  notification: INotificationItem;
}

export default function Notification_Icon({ notification }: Props) {
  console.log('🚀 ~ Notification_Icon ~ notification:', notification?.action);
  const notificationType = notification;

  if (notificationType.action === NotificationActions.ADD_AID && notificationType?.aidType) {
    const AIDS_MAP = getAidsTypes();
    const aidType = notificationType.aidType as keyof typeof TYPE_AIDS;
    const AidIcon = AIDS_MAP[aidType]?.icon;

    if (AidIcon)
      return (
        <ThemeIcon color='blue' variant='light' size={40} radius='100%'>
          <AidIcon size={20} />
        </ThemeIcon>
      );
  }

  const ActionIcon = Notification_Actions_ICONS[notificationType.action];
  if (ActionIcon)
    return (
      <ThemeIcon color='teal' variant='light' size={40} radius='100%'>
        <ActionIcon size={20} />
      </ThemeIcon>
    );

  return (
    <ThemeIcon color='gray' variant='light' size={40} radius='100%'>
      <PlusCircle size={20} />
    </ThemeIcon>
  );
}
