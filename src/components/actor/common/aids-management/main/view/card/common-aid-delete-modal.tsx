'use client';
import { deleteAid, IDeleteAidProps } from '@/actions/actor/common/aids-management/deleteAid';
import useAuth from '@/hooks/useAuth';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { IActionResponse } from '@/types/common/action-response.type';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ICommonAidDeleteModalProps {
  aidId: number;
  opened: boolean;
  close: () => void;
}

export default function CommonAidDeleteModal({ aidId, opened, close }: ICommonAidDeleteModalProps) {
  const queryClient = useQueryClient();
  const { user, isManager } = useAuth();
  const { userId, userType } = useAlreadyUserStore();

  const isAvailableToDelete = user?.id == userId && user.role == userType && isManager;
  const deleteMutation = useMutation<IActionResponse, unknown, IDeleteAidProps>({
    mutationFn: deleteAid,
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
        queryClient.invalidateQueries({ queryKey: ['aids'] });
      } else {
        throw new Error(data.error || 'فشل في الحذف');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'فشل في الحذف';
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
    if (isAvailableToDelete) {
      deleteMutation.mutate({
        aidId,
        managerId: user?.id as number,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => close()}
      title={
        <Text fz={18} fw={600} ta='center' className='text-red-500!'>
          تأكيد الحذف
        </Text>
      }
      classNames={{
        title: '!w-full',
      }}
      centered
    >
      <Stack>
        <Text fz={16} fw={500}>
          هل أنت متأكد من حذف هذه المساعدة؟ هذا الإجراء لا يمكن التراجع عنه.
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
            className='bg-red-500! shadow-md!'
            loading={deleteMutation.isPending}
            onClick={handleClick}
          >
            حذف
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
