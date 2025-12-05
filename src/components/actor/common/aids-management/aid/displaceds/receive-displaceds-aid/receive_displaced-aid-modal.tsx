'use client';

import {
  IReceiveDisplacedAidProps,
  receiveDisplacedAid,
} from '@/actions/actor/common/aids-management/receiveDisplacedAid';
import { USER_TYPE } from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import { IActionResponse } from '@/types/common/action-response.type';
import { otpFormSchema, TOtpFormValues } from '@/validations/auth/otp.schema';
import { Button, Group, LoadingOverlay, Modal, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { zod4Resolver } from 'mantine-form-zod-resolver';

interface CommonReceiveDisplacedAidModalProps {
  displacedId?: number;
  opened: boolean;
  close: () => void;
  aidId: number;
}

export default function ReceiveDisplacedAidModal({
  displacedId,
  opened,
  close,
  aidId,
}: CommonReceiveDisplacedAidModalProps) {
  const { user } = useAuth();

  const form = useForm<TOtpFormValues>({
    mode: 'uncontrolled',
    initialValues: { otp: '' },
    validate: zod4Resolver(otpFormSchema),
  });

  const receiveMutation = useMutation<IActionResponse, unknown, IReceiveDisplacedAidProps>({
    mutationFn: receiveDisplacedAid,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم تسليم المساعدة بنجاح',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
      } else {
        throw new Error(data.error || 'حدث خطأ أثناء تسليم المساعدة');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'حدث خطأ أثناء تسليم المساعدة';
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
      close();
    },
  });

  const handleSubmit = form.onSubmit((values: TOtpFormValues) => {
    if (!displacedId || !user?.role || !user?.id) {
      notifications.show({
        title: 'بيانات ناقصة',
        message: 'تأكد من تسجيل الدخول ووجود كافة البيانات',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
      return;
    }

    receiveMutation.mutate({
      aidId,
      receiveCode: values.otp,
      displacedId: displacedId,
      role: user.role as USER_TYPE.DELEGATE | USER_TYPE.MANAGER,
      actorId: user.id,
    });

    form.reset();
  });

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={20} fw={600} ta='center' className='text-primary!'>
          تسليم المساعدة
        </Text>
      }
      classNames={{ title: '!w-full' }}
      centered
    >
      <form className='flex flex-col items-center gap-0 relative!' onSubmit={handleSubmit}>
        <LoadingOverlay
          visible={receiveMutation.isPending}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />
        <Stack gap={20} justify='space-between'>
          <Text fz={16} fw={500}>
            قم بإدخال كود الاستلام المرسل في إشعار المساعدة
          </Text>
          <PinInput
            disabled={receiveMutation.isPending}
            type='number'
            size='md'
            length={4}
            placeholder=''
            classNames={{
              root: 'gap-5',
              input: 'border-1 border-[#DFDEDC] w-12 h-12 rounded-lg focus:border-primary',
            }}
            mx='auto'
            key={form.key('otp')}
            {...form.getInputProps('otp')}
            autoFocus
          />
          <Group justify='center'>
            <Button
              type='button'
              variant='outline'
              onClick={close}
              fw={600}
              size='sm'
              className='border-primary! text-primary!'
            >
              إلغاء
            </Button>
            <Button
              type='submit'
              className='bg-primary!'
              size='sm'
              loading={receiveMutation.isPending}
            >
              تسليم
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
