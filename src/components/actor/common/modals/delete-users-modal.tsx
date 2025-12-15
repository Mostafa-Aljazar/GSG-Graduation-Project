'use client';

import { deleteUsers, IDeleteUsersProps } from '@/actions/actor/common/modals/deleteUsers';
import { USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import { IActionResponse } from '@/types/common/action-response.type';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IDeleteUsersModalProps {
  userIds: string[];
  userType: USER_TYPE;
  opened: boolean;
  close: () => void;
}

export default function DeleteUsersModal({
  userIds,
  userType,
  opened,
  close,
}: IDeleteUsersModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<IActionResponse, unknown, IDeleteUsersProps>({
    mutationFn: deleteUsers,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تمت العملية بنجاح',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
        if (userType == USER_TYPE.DISPLACED) {
          queryClient.invalidateQueries({ queryKey: ['displaceds'] });
        } else if (userType == USER_TYPE.DELEGATE) {
          queryClient.invalidateQueries({ queryKey: ['delegates'] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['securities'] });
        }
      } else {
        throw new Error(data.error || 'فشل في الحذف');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في الحذف',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ userIds, userType });
  };

  const single = userIds.length === 1;
  const userLabel = USER_RANK_LABELS[userType];

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <Text fz={18} fw={600} ta='center' className='text-red-500!'>
          تأكيد الحذف
        </Text>
      }
      classNames={{ title: 'w-full!' }}
    >
      <Stack>
        <Text fz={16} fw={500}>
          {single
            ? `هل أنت متأكد من حذف هذا ${userLabel}؟ هذا الإجراء لا يمكن التراجع عنه.`
            : `هل أنت متأكد من حذف هؤلاء ${userLabel}؟ هذا الإجراء لا يمكن التراجع عنه.`}
        </Text>

        {userType === USER_TYPE.DELEGATE && (
          <Text fz={16} fw={500} className='text-red-500!'>
            ملاحظة / سيتم نقل النازحين الخاضعين لهؤلاء المندوبين إلى المندوب الافتراضي (بدون مندوب).
          </Text>
        )}

        <Group justify='flex-end'>
          <Button
            size='sm'
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
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            className='bg-red-500! shadow-md!'
          >
            حذف
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
