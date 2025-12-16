'use client';

import { ActionIcon, Button, Group, Modal, Stack, Text, ThemeIcon } from '@mantine/core';
import { Trash2 } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  deleteComplaint,
  IDeleteComplaintFunProps,
} from '@/actions/actor/general/complaints/deleteComplaint';
import { IActionResponse } from '@/types/common/action-response.type';

interface IDeleteComplaintProps {
  complaintId: string;
}

export default function DeleteComplaint({ complaintId }: IDeleteComplaintProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<IActionResponse, unknown, IDeleteComplaintFunProps>({
    mutationFn: deleteComplaint,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم الحذف',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        queryClient.invalidateQueries({ queryKey: ['common-complaints'] });
        close();
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

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteMutation.mutate({
      complaintId,
    });
  };

  return (
    <>
      <ActionIcon
        data-click='delete'
        variant='subtle'
        color='red'
        className='rounded-full!'
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          open();
        }}
        aria-label='حذف الشكوى'
      >
        <Trash2 size={18} />
      </ActionIcon>

      <Modal
        data-click='delete'
        opened={opened}
        onClose={close}
        size='sm'
        radius='md'
        centered
        overlayProps={{ blur: 3 }}
        title={
          <Group justify='center' align='center' gap='xs'>
            <Text fz={16} fw={600} className='text-red-600!'>
              تأكيد الحذف
            </Text>
            <ThemeIcon color='red' variant='light' size='sm'>
              <Trash2 size={16} />
            </ThemeIcon>
          </Group>
        }
        classNames={{ title: '!w-full' }}
      >
        <Stack>
          <Text fz={16} fw={500} c='gray.7'>
            هل أنت متأكد من حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء.
          </Text>

          <Group justify='flex-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className='border-primary! text-primary!'
            >
              إلغاء
            </Button>

            <Button
              size='sm'
              className='bg-red-600! text-white!'
              loading={deleteMutation.isPending}
              onClick={handleClick}
            >
              حذف
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
