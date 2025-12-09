'use client';

import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IActionResponse } from '@/types/common/action-response.type';
import { deleteWrittenContent } from '@/actions/actor/manager/written-content/deleteWrittenContent';

interface IWrittenContentDeleteModalProps {
  id: string;
  type: TYPE_WRITTEN_CONTENT;
  opened: boolean;
  close: () => void;
  managerId: string;
}

export default function WrittenContentDeleteModal({
  id,
  type,
  opened,
  close,
  managerId,
}: IWrittenContentDeleteModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<IActionResponse, unknown, unknown>({
    mutationFn: () =>
      deleteWrittenContent({
        contentId: id,
        managerId,
        type,
      }),

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
        queryClient.invalidateQueries({ queryKey: ['written-content'] });
        return;
      }

      throw new Error(data.error || 'فشل في الحذف');
    },

    onError: (err: any) => {
      const msg = err?.message || 'فشل في الحذف';

      notifications.show({
        title: 'خطأ',
        message: msg,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({});
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={18} fw={600} ta='center' className='text-red-500!'>
          تأكيد الحذف
        </Text>
      }
      classNames={{ title: '!w-full' }}
      centered
    >
      <Stack>
        <Text fz={16} fw={500}>
          هل أنت متأكد من حذف هذا المحتوى ؟ هذا الإجراء لا يمكن التراجع عنه.
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
            onClick={handleDelete}
          >
            حذف
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
