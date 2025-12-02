'use client';

import {
  Modal,
  Stack,
  Group,
  Text,
  Paper,
  ThemeIcon,
  Textarea,
  Button,
  Divider,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Calendar, Clock, MessageSquareReply, UserCircle } from 'lucide-react';
import { parseAsStringEnum, useQueryStates } from 'nuqs';
import { cn } from '@/utils/cn';
import { IComplaint } from '@/types/actor/general/complaints/complaints-response.type';
import { IcommonActionResponse } from '@/types/common/action/commonActionResponse.type';
import { replyCommonComplaint, IReplyCommonComplaintProps } from '@/actions/actor/genral/complaints/replyCommonComplaint';
import { USER_RANK, USER_RANK_LABELS, USER_TYPE, TUserRank, TUserType } from '@/constants/user-types';
import { z } from 'zod';
import useAuth from '@/hooks/useAuth';
import { COMPLAINTS_TABS } from '@/types/actor/common/index.type';

const complaintSchema = z.object({
  reply: z.string().min(3, 'الرجاء إدخال الرد'),
});

type TComplaintType = z.infer<typeof complaintSchema>;

interface ICommonComplaintModalProps {
  complaint: IComplaint;
  actor_Id: number;
  role: TUserType | TUserRank;
  opened: boolean;
  close: () => void;
}

export default function CommonComplaintModal({
  complaint,
  actor_Id,
  role,
  opened,
  close,
}: ICommonComplaintModalProps) {
  const { user } = useAuth();

  const [query] = useQueryStates({
    'complaints-tab': parseAsStringEnum(Object.values(COMPLAINTS_TABS)).withDefault(
      COMPLAINTS_TABS.SENT_COMPLAINTS
    ),
  });

  const form = useForm<TComplaintType>({
    initialValues: { reply: '' },
    validate: zodResolver(complaintSchema),
  });

  const replyMutation = useMutation<IcommonActionResponse, unknown, IReplyCommonComplaintProps>({
    mutationFn: replyCommonComplaint,
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

  const handleSubmit = (values: TComplaintType) => {
    replyMutation.mutate({
      reply: values.reply,
      complaint_Id: complaint.id,
      actor_Id,
      role: role as Exclude<TUserRank, typeof USER_RANK.SECURITY_OFFICER | typeof USER_RANK.DISPLACED>,
    });
  };

  const isReceived = query['complaints-tab'] === COMPLAINTS_TABS.RECEIVED_COMPLAINTS;
  const isSent = query['complaints-tab'] === COMPLAINTS_TABS.SENT_COMPLAINTS;

  const isReply =
    user?.role === USER_TYPE.MANAGER ||
    ((user?.role === USER_TYPE.DELEGATE || user?.rank === USER_RANK.SECURITY_OFFICER) &&
      query['complaints-tab'] === COMPLAINTS_TABS.RECEIVED_COMPLAINTS);

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
              {(() => {
                const isOwner = user?.id === actor_Id && user?.role === role;
                // REFACTOR: add user profile link
                if (role === USER_TYPE.DISPLACED) {
                  return (
                    <>
                      إلى: {complaint.receiver.name} ({USER_RANK_LABELS[complaint.receiver.role]})
                    </>
                  );
                }

                if (role === USER_TYPE.MANAGER) {
                  return (
                    <>
                      من: {complaint.sender.name} ({USER_RANK_LABELS[complaint.sender.role]})
                    </>
                  );
                }

                if (
                  (role === USER_TYPE.DELEGATE || role === USER_TYPE.SECURITY_PERSON) &&
                  query['complaints-tab'] === COMPLAINTS_TABS.RECEIVED_COMPLAINTS
                ) {
                  return (
                    <>
                      من: {complaint.sender.name} ({USER_RANK_LABELS[complaint.sender.role]})
                    </>
                  );
                }

                if (
                  (role === USER_TYPE.DELEGATE || role === USER_TYPE.SECURITY_PERSON) &&
                  query['complaints-tab'] === COMPLAINTS_TABS.SENT_COMPLAINTS
                ) {
                  return (
                    <>
                      إلى: {complaint.receiver.name} ({USER_RANK_LABELS[complaint.receiver.role]})
                    </>
                  );
                }

                // fallback if no specific role match
                if (isReceived) {
                  return (
                    <>
                      من: {complaint.sender.name} ({USER_RANK_LABELS[complaint.sender.role]})
                    </>
                  );
                }

                if (isSent) {
                  return (
                    <>
                      إلى: {complaint.receiver.name} ({USER_RANK_LABELS[complaint.receiver.role]})
                    </>
                  );
                }

                return null;
              })()}
            </Text>
          </Group>

          <Group gap={5}>
            <ThemeIcon size='sm' variant='light' color='yellow'>
              <Calendar size={16} />
            </ThemeIcon>
            <Text size='sm' c='dimmed'>
              {/* {complaint.date} - {complaint.time} */}
              {complaint.date}
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

        {isReply && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Textarea
                size='sm'
                label={
                  <Text size='sm' fw={500} className='!text-primary'>
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
                  className='!border-primary !text-primary'
                >
                  إلغاء
                </Button>
                <Button
                  size='sm'
                  type='submit'
                  disabled={!form.values.reply.trim()}
                  className={cn(
                    'shadow-md',
                    !form.values.reply.trim() ? '!bg-primary/70' : '!bg-primary'
                  )}
                  loading={replyMutation.isPending}
                >
                  تأكيد
                </Button>
              </Group>
            </Stack>
          </form>
        )}

        {!isReply && (
          <Group justify='flex-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={close}
              className='!border-red-500 !text-red-500'
            >
              إغلاق
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
