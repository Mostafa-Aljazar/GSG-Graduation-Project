'use client';

import {
  ISendUpdateDelegatesRequestProps,
  sendUpdateDelegatesRequest,
} from '@/actions/actor/general/delegates/sendUpdateDelegatesRequest';
import { IActionResponse } from '@/types/common/action-response.type';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

interface IUpdateDelegateModalProps {
  delegateIds: number[];
  opened: boolean;
  close: () => void;
}

export default function UpdateDelegateModal({
  delegateIds,
  opened,
  close,
}: IUpdateDelegateModalProps) {
  const updateMutation = useMutation<IActionResponse, unknown, ISendUpdateDelegatesRequestProps>({
    mutationFn: sendUpdateDelegatesRequest,
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
      const errorMessage = error?.message || 'فشل في الارسال';
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleClick = () => {
    updateMutation.mutate({
      delegateIds,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={18} fw={600} ta={'center'} className='text-primary!'>
          تحديث البيانات
        </Text>
      }
      classNames={{
        title: '!w-full',
      }}
      centered
    >
      <Stack>
        <Text fz={16} fw={500}>
          الرجاء التوجه لتحديث البيانات
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
