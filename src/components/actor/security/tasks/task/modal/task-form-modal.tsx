'use client';

import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Stack,
  Text,
  Textarea,
  TextInput,
  Select,
  Divider,
  ThemeIcon,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { startTransition, useEffect, useState } from 'react';
import { Send, X, ShieldAlert, Clock4, FileText, UserCheck, ClipboardList } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ITask } from '@/types/actor/security/tasks/TasksResponse.type';
import {
  saveTaskFormSchema,
  TSaveTaskFormValues,
} from '@/validations/actor/securities/task/save-task-form.schema';

import { TASKS_TABS } from '@/types/actor/common/index.type';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { saveSecurityTask } from '@/actions/actor/securities/tasks/saveSecurityTask';
import useGetSecuritiesNames from '@/hooks/useGetSecuritiesNames';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { ISecuritiesName } from '@/types/actor/general/securities/securities-response.types';

// interface ISecurityMan {
//   string: string;
//   name: string;
// }

interface ITaskFormModalProps {
  opened: boolean;
  onClose: () => void;
  taskToEdit?: ITask | null;
}

export default function TaskFormModal({ opened, onClose, taskToEdit }: ITaskFormModalProps) {
  const [securityData, setSecurityData] = useState<ISecuritiesName[]>([]);
  const queryClient = useQueryClient();

  const form = useForm<TSaveTaskFormValues>({
    initialValues: {
      title: '',
      body: '',
      dateTime: new Date(),
      securitiesIds: [],
      type: TASKS_TABS.COMPLETED_TASKS,
    },
    validate: zod4Resolver(saveTaskFormSchema),
  });

  useEffect(() => {
    if (taskToEdit) {
      form.setValues({
        title: taskToEdit.title,
        body: taskToEdit.body,
        dateTime: new Date(taskToEdit.dateTime),
        securitiesIds: taskToEdit.securitiesIds.map(String),
        type: taskToEdit.type,
      });
    }
  }, [taskToEdit, opened]);

  const { securitiesData: securityNames, isLoading } = useGetSecuritiesNames({
    mode: ACTION_ADD_EDIT_DISPLAY.DISPLAY,
  });

  useEffect(() => {
    if (securityNames?.securitiesNames) {
      const mapped = securityNames.securitiesNames.map((s) => ({
        ...s,
        id: String(s.id),
      }));
      startTransition(() => setSecurityData(mapped));
    }
  }, [securityNames]);

  const taskMutation = useMutation({
    mutationFn: async (data: TSaveTaskFormValues) => {
      const payload = {
        ...data,
        securitiesIds: data.securitiesIds.map(Number),
      };

      if (taskToEdit) {
        return await saveSecurityTask({
          taskId: taskToEdit.id,
          ...payload,
        });
      }

      return await saveSecurityTask(payload);
    },

    onSuccess: (res) => {
      notifications.show({
        title: 'نجاح',
        message: res.message,
        color: 'grape',
        position: 'top-left',
        withBorder: true,
      });

      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['security-tasks'] });
    },

    onError: (err: any) => {
      notifications.show({
        title: 'خطأ',
        message: err?.message || 'فشل في العملية',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = (values: TSaveTaskFormValues) => {
    taskMutation.mutate(values);
  };

  const securityOptions = [
    ...securityData.map((s) => ({ value: s.id, label: s.name })),
    ...form.values.securitiesIds
      .filter((id) => !securityData.some((d) => d.id === id))
      .map((id) => ({ value: id, label: `عنصر #${id}` })),
  ];

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={
        <Text fz={18} fw={600} ta='center' className='text-primary!'>
          {taskToEdit ? 'تعديل المهمة' : 'إنشاء مهمة أمنية جديدة'}
        </Text>
      }
      centered
      overlayProps={{ blur: 3 }}
      classNames={{ title: '!w-full' }}
      radius='md'
      size='lg'
      pos='relative'
      withCloseButton
      onClick={(e) => e.stopPropagation()}
    >
      <LoadingOverlay
        visible={taskMutation.isPending}
        zIndex={49}
        overlayProps={{ radius: 'sm', blur: 0.3 }}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={20}>
          <TextInput
            label={labelWithIcon(FileText, 'عنوان المهمة')}
            placeholder='أدخل العنوان'
            size='sm'
            radius='md'
            {...form.getInputProps('title')}
          />

          <Textarea
            label={labelWithIcon(ClipboardList, 'تفاصيل المهمة')}
            placeholder='اكتب التفاصيل...'
            size='sm'
            radius='md'
            autosize
            minRows={4}
            {...form.getInputProps('body')}
          />

          <DateTimePicker
            label={labelWithIcon(Clock4, 'التاريخ والوقت')}
            placeholder='اختر التاريخ والوقت'
            withSeconds={false}
            valueFormat='DD/MM/YYYY - hh:mm A'
            size='sm'
            radius='md'
            value={form.values.dateTime}
            onChange={(val) =>
              form.setFieldValue('dateTime', val ? new Date(val) : form.values.dateTime)
            }
            error={form.errors.dateTime}
          />

          <MultiSelect
            label={labelWithIcon(UserCheck, 'عناصر الأمن')}
            placeholder='اختر عناصر الأمن'
            data={securityOptions}
            searchable
            size='sm'
            radius='md'
            nothingFoundMessage='لا توجد نتائج'
            {...form.getInputProps('securitiesIds')}
            disabled={isLoading}
          />

          <Select
            label={labelWithIcon(ShieldAlert, 'نوع المهمة')}
            placeholder='اختر نوع المهمة'
            size='sm'
            radius='md'
            data={[
              { value: TASKS_TABS.UPCOMING_TASKS, label: 'مهمة جارية' },
              { value: TASKS_TABS.COMPLETED_TASKS, label: 'مهمة مكتملة' },
            ]}
            {...form.getInputProps('type')}
          />
        </Stack>

        <Divider my='md' />

        <Group justify='flex-end' mt='md'>
          <Button
            variant='outline'
            color='red'
            size='sm'
            radius='md'
            rightSection={<X size={14} />}
            onClick={() => {
              onClose();
              form.reset();
            }}
            disabled={taskMutation.isPending}
          >
            إلغاء
          </Button>

          <Button
            size='sm'
            radius='md'
            type='submit'
            rightSection={<Send size={16} />}
            className='bg-primary! shadow-md text-white'
            disabled={!form.isValid() || taskMutation.isPending}
          >
            {taskToEdit ? 'تعديل' : 'إنشاء'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

// Helpers
function labelWithIcon(Icon: React.ElementType, text: string) {
  return (
    <Group align='center' gap={8}>
      <ThemeIcon variant='light' size='sm' className='rounded-full!'>
        <Icon size={16} />
      </ThemeIcon>
      <Text fz={16} fw={500}>
        {text}
      </Text>
    </Group>
  );
}
