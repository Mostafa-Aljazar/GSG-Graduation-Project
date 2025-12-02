'use client';

import {
  ISendUpdateUsersRequestProps,
  sendUpdateUsersRequest,
} from '@/actions/actor/common/modals/sendUpdateUsersRequest';
import { USER_TYPE, USER_RANK_LABELS } from '@/constants/user-types';
import { IActionResponse } from '@/types/common/action-response.type';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

interface IUpdateUsersModalProps {
  userIds: number[];
  userType: USER_TYPE;
  opened: boolean;
  close: () => void;
}

export default function UpdateUsersModal({
  userIds,
  userType,
  opened,
  close,
}: IUpdateUsersModalProps) {
  const updateMutation = useMutation<IActionResponse, unknown, ISendUpdateUsersRequestProps>({
    mutationFn: () => sendUpdateUsersRequest({ userIds, userType }),
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم الارسال',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
      } else {
        throw new Error(data.error || 'فشل في الارسال');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في الارسال',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleClick = () => {
    updateMutation.mutate({ userIds, userType });
  };

  const userLabel = USER_RANK_LABELS[userType];
  const single = userIds.length === 1;

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={18} fw={600} ta='center' className='text-primary!'>
          تحديث بيانات {single ? userLabel : `${userLabel}s`}
        </Text>
      }
      classNames={{ title: '!w-full' }}
      centered
    >
      <Stack>
        <Text fz={16} fw={500}>
          {single
            ? `الرجاء التوجه لتحديث بيانات ${userLabel}`
            : `الرجاء التوجه لتحديث بيانات هؤلاء ${userLabel}s`}
        </Text>

        <Group justify='flex-end'>
          <Button
            size='sm'
            type='button'
            variant='outline'
            onClick={close}
            fw={600}
            className='shadow-md! border-primary! text-primary!'
          >
            إلغاء
          </Button>
          <Button
            size='sm'
            type='button'
            className='bg-primary! shadow-md!'
            loading={updateMutation.isPending}
            onClick={handleClick}
          >
            تأكيد
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
