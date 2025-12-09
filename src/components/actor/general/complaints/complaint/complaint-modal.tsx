'use client';

import { Modal, Stack, Group, Text, Paper, ThemeIcon, Textarea, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Calendar, MessageSquareReply, UserCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IComplaint } from '@/types/actor/general/complaints/complaints-response.type';
import { USER_RANK, USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import {
  replyComplaintFormSchema,
  TReplyComplaintFormValues,
} from '@/validations/actor/general/complaints/reply-complaint.schema';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  IReplyComplaintProps,
  replyComplaint,
} from '@/actions/actor/general/complaints/replyComplaint';
import { IActionResponse } from '@/types/common/action-response.type';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';

interface IComplaintModalProps {
  complaint: IComplaint;
  opened: boolean;
  close: () => void;
}

export default function ComplaintModal({ complaint, opened, close }: IComplaintModalProps) {
  const { user, isDisplaced, isManager } = useAuth();
  const { userId: userAlreadyId, userType: userAlreadyType } = useAlreadyUserStore();

  const isOwner = user?.id === userAlreadyId && user?.role === userAlreadyType;

  const connectionInfo = (() => {
    const sender = complaint.sender;
    const receiver = complaint.receiver;

    // If the current user is the owner
    if (isOwner) {
      if (isDisplaced) {
        return (
          <>
            إلى: {receiver.name} ({USER_RANK_LABELS[receiver.role]})
          </>
        );
      }
      if (isManager) {
        return (
          <>
            من: {sender.name} ({USER_RANK_LABELS[sender.role]})
          </>
        );
      }
      // General owner case
      if (user.id === sender.id && user.role === sender.role) {
        return (
          <>
            إلى: {receiver.name} ({USER_RANK_LABELS[receiver.role]})
          </>
        );
      }
      if (user.id === receiver.id && user.role === receiver.role) {
        return (
          <>
            من: {sender.name} ({USER_RANK_LABELS[sender.role]})
          </>
        );
      }
    } else {
      // Not owner, use already user
      if (userAlreadyType === USER_TYPE.DISPLACED) {
        return (
          <>
            إلى: {receiver.name} ({USER_RANK_LABELS[receiver.role]})
          </>
        );
      }
      if (userAlreadyType === USER_TYPE.MANAGER) {
        return (
          <>
            من: {sender.name} ({USER_RANK_LABELS[sender.role]})
          </>
        );
      }
      if (userAlreadyId === sender.id && userAlreadyType === sender.role) {
        return (
          <>
            إلى: {receiver.name} ({USER_RANK_LABELS[receiver.role]})
          </>
        );
      }
      if (userAlreadyId === receiver.id && userAlreadyType === receiver.role) {
        return (
          <>
            من: {sender.name} ({USER_RANK_LABELS[sender.role]})
          </>
        );
      }
    }

    return null;
  })();

  const form = useForm<TReplyComplaintFormValues>({
    initialValues: { reply: '' },
    validate: zod4Resolver(replyComplaintFormSchema),
  });

  const replyMutation = useMutation<IActionResponse, unknown, IReplyComplaintProps>({
    mutationFn: replyComplaint,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم الإرسال',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
        form.reset();
      } else {
        throw new Error(data.error || 'فشل في إرسال الرد');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في إرسال الرد',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = (values: TReplyComplaintFormValues) => {
    replyMutation.mutate({
      reply: values.reply,
      complaintId: complaint.id,
      actorId: user?.id as string,
      role: user?.rank as USER_RANK.SECURITY_OFFICER | USER_TYPE.MANAGER | USER_TYPE.DELEGATE,
    });
  };

  const canReply =
    isOwner && user.id == complaint.receiver.id && user.rank == complaint.receiver.role;

  return (
    <Modal
      opened={opened}
      onClose={close}
      size='lg'
      centered
      radius='md'
      overlayProps={{ blur: 3 }}
      withCloseButton={false}
      title={
        <Text fz={16} fw={600} ta='center'>
          {complaint.title}
        </Text>
      }
      transitionProps={{ transition: 'fade', duration: 200 }}
      classNames={{ title: '!w-full' }}
    >
      <Stack>
        <Group>
          <Group gap={5}>
            <ThemeIcon size='sm' variant='light' color='green'>
              <UserCircle size={16} />
            </ThemeIcon>
            <Text size='sm' c='dimmed'>
              {connectionInfo}
            </Text>
          </Group>

          <Group gap={5}>
            <ThemeIcon size='sm' variant='light' color='yellow'>
              <Calendar size={16} />
            </ThemeIcon>
            <Text size='sm' c='dimmed'>
              {complaint.date.toString()}
            </Text>
          </Group>
        </Group>

        <Paper p='xs' radius='md' withBorder shadow='xs' bg='gray.0'>
          <Group wrap='nowrap' align='flex-start' gap={6}>
            <ThemeIcon size='sm' variant='light' color='blue'>
              <MessageSquareReply size={16} />
            </ThemeIcon>
            <Text size='sm' fw={500}>
              {complaint.body}
            </Text>
          </Group>
        </Paper>

        {complaint.response && (
          <Paper p='xs' radius='md' withBorder shadow='xs' bg='gray.0'>
            <Group wrap='nowrap' align='flex-start' gap={6}>
              <ThemeIcon size='sm' variant='light' color='blue'>
                <MessageSquareReply size={16} />
              </ThemeIcon>
              <Text size='sm' fw={500}>
                {complaint.response}
              </Text>
            </Group>
          </Paper>
        )}

        {!complaint.response && canReply && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Textarea
                size='sm'
                label={
                  <Text size='sm' fw={500} className='text-primary!'>
                    الرد:
                  </Text>
                }
                placeholder='رداً على الشكوى...'
                minRows={3}
                autosize
                {...form.getInputProps('reply')}
                classNames={{
                  input: 'placeholder:!text-sm !text-primary !font-normal',
                }}
              />

              <Group justify='flex-end'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    form.reset();
                    close();
                  }}
                  className='border-primary! text-primary!'
                >
                  إلغاء
                </Button>
                <Button
                  size='sm'
                  type='submit'
                  disabled={!form.values.reply.trim()}
                  className={cn(
                    'shadow-md',
                    !form.values.reply.trim() ? 'bg-primary/70!' : 'bg-primary!'
                  )}
                  loading={replyMutation.isPending}
                >
                  تأكيد
                </Button>
              </Group>
            </Stack>
          </form>
        )}

        {!canReply && (
          <Group justify='flex-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={close}
              className='border-red-500! text-red-500!'
            >
              إغلاق
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
