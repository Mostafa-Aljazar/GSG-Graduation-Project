'use client';

import { Modal, Stack, Group, Text, Paper, ThemeIcon, Flex } from '@mantine/core';
import { UserCircle, Info, Calendar } from 'lucide-react';
import { INotificationItem } from '@/types/actor/general/notification/notification-response.type';
import { USER_RANK_LABELS, TUserRank } from '@/constants/user-types';

interface NotificationModalProps {
  opened: boolean;
  onClose: () => void;
  notification: INotificationItem;
}

export default function Notification_Modal({
  opened,
  onClose,
  notification,
}: NotificationModalProps) {
  const date = notification.dateTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = notification.dateTime.toLocaleTimeString('en-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Modal
      title={
        <Text fz={16} fw={600} ta={'center'}>
          {notification.title}
        </Text>
      }
      opened={opened}
      onClose={onClose}
      size='lg'
      centered
      radius='md'
      overlayProps={{ blur: 3 }}
      transitionProps={{
        transition: 'fade',
        duration: 200,
        timingFunction: 'ease',
      }}
      withCloseButton
      classNames={{
        title: '!w-full',
      }}
    >
      <Stack>
        <Flex direction={{ base: 'column-reverse', md: 'row' }} justify={'space-between'} gap={5}>
          <Group gap={5}>
            <ThemeIcon size='sm' variant='light' color='green'>
              <UserCircle size={16} />
            </ThemeIcon>
            <Text size='sm' c='dimmed'>
              من: {notification.from.name} (
              {` ${USER_RANK_LABELS[notification.from.role as TUserRank]} `})
            </Text>
          </Group>

          <Group gap={5}>
            <ThemeIcon size='sm' variant='light' color='yellow'>
              <Calendar size={16} />
            </ThemeIcon>
            <Text size='sm' c='dimmed'>
              {date}
            </Text>
            <Text size='sm' c='dimmed'>
              {time}
            </Text>
          </Group>
        </Flex>

        <Paper p='xs' radius='md' withBorder shadow='xs' bg='gray.0'>
          <Group wrap='nowrap' align='flex-start' gap={5}>
            <ThemeIcon size='sm' variant='light' color='blue'>
              <Info size={16} />
            </ThemeIcon>
            <Text size='sm' fw={600}>
              {notification.body}
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Modal>
  );
}
