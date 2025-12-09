'use client';

import { changeDelegate, IChangeDelegateProps } from '@/actions/actor/common/modals/changeDelegate';
import useGetDelegatesNames from '@/hooks/useGetDelegatesNames';
import { IActionResponse } from '@/types/common/action-response.type';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  changeDelegateFormSchema,
  TChangeDelegateFormValues,
} from '@/validations/actor/general/displaceds/change-delegate-in-displaceds.schema';
import { Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { zod4Resolver } from 'mantine-form-zod-resolver';

interface IChangeDelegateModalProps {
  displacedIds: string[];
  opened: boolean;
  close: () => void;
}

export default function ChangeDelegateInDisplacedsModal({
  displacedIds,
  opened,
  close,
}: IChangeDelegateModalProps) {
  const form = useForm<TChangeDelegateFormValues>({
    initialValues: {
      delegateId: '',
    },
    validate: zod4Resolver(changeDelegateFormSchema),
  });

  const { delegatesData, isLoading, error } = useGetDelegatesNames({
    mode: ACTION_ADD_EDIT_DISPLAY.DISPLAY,
  });

  const selectData =
    delegatesData?.delegateNames?.map((d) => ({
      value: d.id.toString(),
      label: d.name,
    })) || [];

  const changeMutation = useMutation<IActionResponse, unknown, IChangeDelegateProps>({
    mutationFn: changeDelegate,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم التغيير',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
        form.reset();
        return;
      }

      throw new Error(data.error || 'فشل في تغيير المندوب');
    },
    onError: (err: any) => {
      notifications.show({
        title: 'خطأ',
        message: err?.message || 'فشل في تغيير المندوب',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = (values: TChangeDelegateFormValues) => {
    changeMutation.mutate({
      displacedIds,
      delegateId: values.delegateId,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <Text fz={18} fw={600} ta='center' className='text-primary!'>
          تغيير المندوب
        </Text>
      }
      classNames={{ title: 'w-full!' }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label={
              <Text fz={16} fw={500}>
                المندوب :
              </Text>
            }
            placeholder='اختر المندوب'
            data={selectData}
            size='sm'
            w='100%'
            classNames={{ input: 'text-primary! font-medium!' }}
            disabled={isLoading || !!error}
            error={error ? 'فشل في جلب قائمة المناديب' : undefined}
            {...form.getInputProps('delegateId')}
          />

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
              type='submit'
              loading={changeMutation.isPending}
              className='bg-primary! shadow-md!'
            >
              تأكيد
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
