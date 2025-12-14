'use client';

import { Text, Paper, ThemeIcon, Center, Box } from '@mantine/core';
import { INotificationsResponse } from '@/types/actor/general/notification/notification-response.type';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/actions/actor/general/notifications/getNotifications';
import { parseAsInteger, useQueryStates } from 'nuqs';
import useAuth from '@/hooks/useAuth';
import { TUserType } from '@/constants/user-types';
import { MessageCircleWarning } from 'lucide-react';
import NotificationsList from './notifications-list';

export default function NotificationsContent() {
  const [query] = useQueryStates({
    'notifications-page': parseAsInteger.withDefault(1),
  });

  const { user } = useAuth();
  const limit = 10;

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery<INotificationsResponse, Error>({
    queryKey: ['notifications', query['notifications-page'], user],
    queryFn: () =>
      getNotifications({
        page: query['notifications-page'],
        limit: limit,
        actorId: String(user?.id),
        role: user?.role as TUserType,
      }),
  });

  const hasError = Boolean(error) || Boolean(notificationsData?.error);
  return (
    <Box dir='rtl' w='100%' p='md'>
      {hasError ? (
        <Paper p='sm' withBorder className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {notificationsData?.error || error?.message || 'فشل في تحميل الإشعارات'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <NotificationsList
          notificationItems={notificationsData?.notifications ?? []}
          totalPages={notificationsData?.pagination.totalPages ?? 1}
          loading={isLoading}
        />
      )}
    </Box>
  );
}
