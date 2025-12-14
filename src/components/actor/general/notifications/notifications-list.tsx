'use client';

import { Stack, Text, Paper, Flex, Pagination, Group } from '@mantine/core';
import { INotificationItem } from '@/types/actor/general/notification/notification-response.type';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import NotificationCard from './notification/notification-card';
import NotificationSkeleton from './notification/notification-skeleton';

interface NotificationsListProps {
  notificationItems: INotificationItem[];
  totalPages: number;
  loading: boolean;
}

export default function Notifications_List({
  notificationItems,
  totalPages,
  loading,
}: NotificationsListProps) {
  const [query, setQuery] = useQueryStates({
    'notifications-page': parseAsInteger.withDefault(1),
  });

  return (
    <Stack pos={'relative'}>
      {loading ? (
        <Stack gap='xs'>
          {Array.from({ length: 8 }).map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </Stack>
      ) : notificationItems.length === 0 ? (
        <Paper p='xl' radius='md' withBorder>
          <Group gap={10} w={'100%'} justify='center' mt={30}>
            <MessageCircleWarning size={25} className='text-primary!' />
            <Text fw={500} fz={24} ta='center' className='text-primary!'>
              لا توجد إشعارات حالياً
            </Text>
          </Group>
        </Paper>
      ) : (
        <Stack gap='xs'>
          {notificationItems &&
            notificationItems.map((item) => <NotificationCard key={item.id} notification={item} />)}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Flex justify='center' mt='xl'>
          <Pagination
            value={query['notifications-page']}
            onChange={(value: number) => setQuery({ 'notifications-page': value })}
            total={totalPages}
            size='sm'
            radius='xl'
            withControls={false}
            mx='auto'
            classNames={{
              dots: '!rounded-full !text-gray-300 border-1',
              control: '!rounded-full',
            }}
          />
        </Flex>
      )}
    </Stack>
  );
}
