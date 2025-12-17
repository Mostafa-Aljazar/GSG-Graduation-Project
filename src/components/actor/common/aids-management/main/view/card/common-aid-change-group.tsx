'use client';
import {
  changeStatusAid,
  IChangeStatusAidProps,
} from '@/actions/actor/common/aids-management/changeStatusAid';
import useAuth from '@/hooks/useAuth';
import { getAidsManagementTabs, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { IActionResponse } from '@/types/common/action-response.type';
import { Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import z from 'zod';

export const changeAidGroupFormSchema = z.object({
  aidGroup: z.enum(TYPE_GROUP_AIDS),
});

export type TChangeAidGroupFormValues = z.infer<typeof changeAidGroupFormSchema>;

interface ICommonAidChangeGroupModalProps {
  aidId: string;
  opened: boolean;
  close: () => void;
}

export default function CommonAidChangeGroupModal({
  aidId,
  opened,
  close,
}: ICommonAidChangeGroupModalProps) {
  const form = useForm<TChangeAidGroupFormValues>({
    initialValues: {
      aidGroup: '' as TYPE_GROUP_AIDS,
    },
    validate: zod4Resolver(changeAidGroupFormSchema),
  });

  const queryClient = useQueryClient();
  const { isManager } = useAuth();

  const changeStatusMutation = useMutation<IActionResponse, unknown, IChangeStatusAidProps>({
    mutationFn: changeStatusAid,
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
        throw new Error(data.error || 'فشل في التغيير');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'فشل في التغيير';
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const selectData = [
    { value: TYPE_GROUP_AIDS.COMING_AIDS, label: getAidsManagementTabs().COMING_AIDS.label },
    { value: TYPE_GROUP_AIDS.ONGOING_AIDS, label: getAidsManagementTabs().ONGOING_AIDS.label },
    { value: TYPE_GROUP_AIDS.PREVIOUS_AIDS, label: getAidsManagementTabs().PREVIOUS_AIDS.label },
  ];

  const handleSubmit = (values: TChangeAidGroupFormValues) => {
    if (isManager) {
      changeStatusMutation.mutate({
        aidId,
        aidGroup: values.aidGroup,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => close()}
      title={
        <Text fz={18} fw={600} ta='center' className='text-red-500!'>
          تغيير حالة المساعدة
        </Text>
      }
      classNames={{
        title: '!w-full',
      }}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label={
              <Text fz={16} fw={500}>
                حالة المساعدة :
              </Text>
            }
            placeholder='اختر النوع'
            data={selectData}
            size='sm'
            w='100%'
            classNames={{ input: 'text-primary! font-medium!' }}
            disabled={changeStatusMutation.isPending}
            {...form.getInputProps('aidGroup')}
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
              loading={changeStatusMutation.isPending}
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
