'use client';

import {
  ISendUsersActionRequestProps,
  sendUsersActionRequest,
} from '@/actions/actor/common/modals/sendUserActionRequest';
import { USER_TYPE, USER_RANK_LABELS } from '@/constants/user-types';
import { IActionResponse } from '@/types/common/action-response.type';
import {
  sendUsersActionRequestFormSchema,
  TSendUsersActionRequestFormValues,
} from '@/validations/actor/general/common/send-users-action-request.schema';
import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { zod4Resolver } from 'mantine-form-zod-resolver';

interface ISendUsersActionModalProps {
  userIds: number[];
  userType: USER_TYPE;
  action: 'call' | 'meeting';
  opened: boolean;
  close: () => void;
}

export default function SendUsersActionModal({
  userIds,
  userType,
  action,
  opened,
  close,
}: ISendUsersActionModalProps) {
  const form = useForm<TSendUsersActionRequestFormValues>({
    initialValues: {
      dateTime: dayjs().add(1, 'hour').toDate(),
      details: '',
    },
    validate: zod4Resolver(sendUsersActionRequestFormSchema),
  });

  const mutation = useMutation<IActionResponse, unknown, ISendUsersActionRequestProps>({
    mutationFn: (values) =>
      sendUsersActionRequest({
        userIds,
        userType,
        dateTime: values.dateTime,
        details: values.details,
        action,
      }),
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: action === 'call' ? 'تم الاستدعاء' : 'تم إرسال طلب الاجتماع',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
        form.reset();
      } else {
        throw new Error(data.error || 'فشل في تنفيذ العملية');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في تنفيذ العملية',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = (values: TSendUsersActionRequestFormValues) => {
    mutation.mutate({
      userIds,
      userType,
      dateTime: values.dateTime,
      details: values.details,
      action,
    });
  };

  const actionLabel = action === 'call' ? 'استدعاء' : 'طلب اجتماع';
  const userLabel = USER_RANK_LABELS[userType];

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={18} fw={600} ta='center' className='text-primary!'>
          {`إضافة تفاصيل ${actionLabel} لـ ${userLabel}`}
        </Text>
      }
      classNames={{ title: '!w-full' }}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <DateTimePicker
            label={
              <Text fz={16} fw={500} className='text-primary!'>
                تاريخ ووقت {actionLabel}
              </Text>
            }
            placeholder={`تاريخ ووقت ${actionLabel}`}
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: '12h',
            }}
            valueFormat='DD/MM/YYYY - hh:mm A'
            value={form.values.dateTime}
            onChange={(value) =>
              form.setFieldValue('dateTime', value ? new Date(value) : form.values.dateTime)
            }
            error={form.errors.dateTime}
            classNames={{ input: 'placeholder:text-sm! text-primary! font-normal!' }}
          />

          <Textarea
            size='sm'
            label={
              <Text fz={16} fw={500} className='text-primary!'>
                تفاصيل {actionLabel}
              </Text>
            }
            placeholder='أدخل التفاصيل'
            minRows={2}
            maxRows={6}
            autosize
            {...form.getInputProps('details')}
            classNames={{ input: 'placeholder:text-sm! text-primary! font-normal!' }}
          />

          <Group justify='flex-end'>
            <Button
              size='sm'
              type='button'
              variant='outline'
              onClick={close}
              fw={600}
              className='border-primary! text-primary!'
            >
              إلغاء
            </Button>
            <Button
              size='sm'
              type='submit'
              className='bg-primary! shadow-md!'
              loading={mutation.isPending}
            >
              تأكيد
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
