'use client';

import {
  ISendComplaintProps,
  sendComplaint,
} from '@/actions/actor/general/complaints/sendComplaint';
import {
  USER_RANK,
  USER_RANK_LABELS,
  USER_TYPE,
  TUserRank,
  TUserType,
} from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import { IActionResponse } from '@/types/common/action-response.type';
import { cn } from '@/utils/cn';
import {
  sendComplaintFormSchema,
  TSendComplaintFormValues,
} from '@/validations/actor/general/complaints/send-complaint.schema';
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { MessageSquareDiff, Send, X } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const ALLOWED_RECEPTIONS: Record<TUserRank, TUserRank[]> = {
  DISPLACED: [USER_TYPE.MANAGER, USER_TYPE.DELEGATE, USER_RANK.SECURITY_OFFICER],
  DELEGATE: [USER_TYPE.MANAGER, USER_RANK.SECURITY_OFFICER],
  SECURITY_PERSON: [USER_TYPE.MANAGER, USER_RANK.SECURITY_OFFICER],
  SECURITY_OFFICER: [USER_TYPE.MANAGER],
  MANAGER: [],
};

export default function SendComplaint() {
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  // const [valid, setValid] = useState(false);

  const allowedReceptions = (user?.role && ALLOWED_RECEPTIONS[user.role as TUserType]) || [];

  const dynamicReceptionOptions = allowedReceptions.map((value: TUserRank) => ({
    value: value,
    label: USER_RANK_LABELS[value],
  }));

  const formSchema = sendComplaintFormSchema.refine(
    (data) => {
      if (data.reception === null) {
        return false;
      }
      return allowedReceptions.includes(data.reception as TUserRank);
    },
    {
      path: ['reception'],
      message: 'جهة الاستقبال غير صالحة لهذا الدور',
    }
  ) as any;

  const form = useForm<TSendComplaintFormValues>({
    initialValues: {
      reception: null as any,
      title: '',
      content: '',
    },
    validate: zod4Resolver(formSchema),
  });

  const sendCommonComplaintMutation = useMutation<IActionResponse, unknown, ISendComplaintProps>({
    mutationFn: sendComplaint,
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
        form.reset();
      } else {
        throw new Error(data.error || 'فشل في إرسال الشكوى');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في إرسال الشكوى',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = (values: TSendComplaintFormValues) => {
    if (!user?.id || !user?.role) return;

    sendCommonComplaintMutation.mutate({
      reception: values.reception as ISendComplaintProps['reception'],
      title: values.title,
      content: values.content,
    });
  };

  const disabled = sendCommonComplaintMutation.isPending || allowedReceptions.length === 0;

  return (
    <>
      <Button
        type='button'
        size='sm'
        radius='md'
        onClick={open}
        rightSection={<MessageSquareDiff size={16} />}
        className='bg-primary! shadow-md font-semibold text-white'
        disabled={disabled}
      >
        تقديم شكوى
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title={
          <Text size='lg' fw={600} ta='center' className='text-primary'>
            إرسال شكوى جديدة
          </Text>
        }
        centered
        size='lg'
        radius='md'
        overlayProps={{ blur: 2, backgroundOpacity: 0.55 }}
        classNames={{ title: '!w-full' }}
        pos={'relative'}
      >
        <LoadingOverlay
          visible={sendCommonComplaintMutation.isPending}
          zIndex={49}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap='md' mt='xs'>
            <Select
              label='شكوى إلى'
              placeholder='اختر الجهة المستقبلة...'
              data={dynamicReceptionOptions}
              size='sm'
              radius='md'
              withAsterisk
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              {...form.getInputProps('reception')}
              disabled={disabled}
            />

            <TextInput
              label='عنوان الشكوى'
              placeholder='أدخل عنوان الشكوى...'
              size='sm'
              radius='md'
              withAsterisk
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              {...form.getInputProps('title')}
              disabled={disabled}
            />

            <Textarea
              label='محتوى الشكوى'
              placeholder='اكتب تفاصيل الشكوى هنا...'
              autosize
              minRows={4}
              maxRows={8}
              size='sm'
              radius='md'
              withAsterisk
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              {...form.getInputProps('content')}
              disabled={disabled}
            />

            <Group justify='flex-end' mt='xs'>
              <Button
                variant='outline'
                color='red'
                size='sm'
                radius='md'
                rightSection={<X size={14} />}
                onClick={() => {
                  close();
                  form.reset();
                }}
                disabled={sendCommonComplaintMutation.isPending}
              >
                إلغاء
              </Button>

              <Button
                size='sm'
                type='submit'
                radius='md'
                rightSection={<Send size={14} />}
                className={cn(
                  'shadow-lg text-white',
                  Object.keys(form.errors).length > 0 ? 'bg-primary/70!' : 'bg-primary!'
                )}
                disabled={Object.keys(form.errors).length > 0 || disabled}
              >
                إرسال
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
