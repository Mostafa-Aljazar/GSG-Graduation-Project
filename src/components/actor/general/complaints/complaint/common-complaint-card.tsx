'use client';

import { Box, Card, Flex, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { cn } from '@/utils/cn';
import { IComplaint } from '@/types/actor/general/complaints/complaints-response.type';
import Image from 'next/image';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IcommonActionResponse } from '@/types/common/action/commonActionResponse.type';
import man from "@/assets/actor/man.svg";
import { parseAsStringEnum, useQueryStates } from 'nuqs';
import { changeStatusCommonComplaint, IChangeStatusCommonComplaintProps } from '@/actions/actor/genral/complaints/changeStatusCommonComplaint';
import { USER_RANK, USER_RANK_LABELS, USER_TYPE, TUserRank, TUserType } from '@/constants/user-types';
import CommonDeleteComplaint from './common-delete-complaint';
import CommonComplaintModal from './common-complaint-modal';
import useAuth from '@/hooks/useAuth';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { Calendar, User, FileText, MailWarning, CheckCircle2, Clock } from 'lucide-react';

interface ICommonComplaintCardProps {
  complaint: IComplaint;
  actor_Id: number;
  role: TUserType | TUserRank;
}

export default function CommonComplaintCard({
  complaint,
  actor_Id,
  role,
}: ICommonComplaintCardProps) {
  const [query] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(
      Object.values(COMPLAINTS_TABS)
    ).withDefault(COMPLAINTS_TABS.SENT_COMPLAINTS),
  });

  const { user } = useAuth();
  const isOwner = user?.id === actor_Id && user?.role === role;

  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation<
    IcommonActionResponse,
    unknown,
    IChangeStatusCommonComplaintProps
  >({
    mutationFn: changeStatusCommonComplaint,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تمت العملية بنجاح',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        queryClient.invalidateQueries({ queryKey: ['common-complaints'] });
      } else {
        throw new Error(data.error || 'فشل في تغيير حالة الشكوى');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في تغيير حالة الشكوى',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    const clickedOnDelete = path.some((el) => {
      const attr = (el as HTMLElement)?.getAttribute?.('data-click');
      const classes = (el as HTMLElement)?.classList?.toString() || '';
      return attr === 'delete' || classes.includes('delete');
    });

    if (!clickedOnDelete) {
      if (
        query['complaints-tab'] === COMPLAINTS_TABS.RECEIVED_COMPLAINTS &&
        complaint.status === COMPLAINTS_STATUS.PENDING &&
        user?.role !== USER_TYPE.DISPLACED
      ) {
        changeStatusMutation.mutate({
          complaint_Id: complaint.id,
          actor_Id,
          role: role as Exclude<TUserRank, typeof USER_RANK.SECURITY_PERSON | typeof USER_RANK.DISPLACED>,
        });
      }
      open();
    }
  };

  return (
    <>
      <Card
        key={complaint.id}
        p='md'
        radius='lg'
        shadow='sm'
        className={cn(
          'hover:shadow-md !border !border-gray-300 transition-all cursor-pointer',
          complaint.status === COMPLAINTS_STATUS.READ ? '!bg-gray-50' : '!bg-red-50'
        )}
        onClick={handleClick}
      >
        <Group align='flex-start' gap='md'>
          <Box
            className='bg-primary border border-gray-300 rounded-full overflow-hidden'
            w={60}
            h={60}
          >
            <Image src={man} alt='Profile' width={60} height={60} className='object-cover' />
          </Box>

          <Stack flex={1} gap={6}>
            <Flex justify='space-between' align='center'>
              <Group gap={6}>
                <ThemeIcon size='sm' variant='light' color='blue'>
                  <Calendar size={14} />
                </ThemeIcon>
                <Text size='xs' c='dimmed'>
                  {complaint.date}
                </Text>
              </Group>
              <Group gap={6}>
                <ThemeIcon
                  size='sm'
                  variant='light'
                  color={complaint.status === COMPLAINTS_STATUS.READ ? 'green' : 'orange'}
                >
                  {complaint.status === COMPLAINTS_STATUS.READ ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                </ThemeIcon>
                <Text size='xs' c='dimmed'>
                  {complaint.status === COMPLAINTS_STATUS.READ ? 'مقروءة' : 'قيد الانتظار'}
                </Text>
              </Group>
            </Flex>

            <Group gap={6}>
              <ThemeIcon size='sm' variant='light' color='violet'>
                <User size={14} />
              </ThemeIcon>
              <Text fz={15} fw={600} c='dark'>
                {query['complaints-tab'] == COMPLAINTS_TABS.RECEIVED_COMPLAINTS &&
                  `من ${USER_RANK_LABELS[complaint.sender.role]}: ${complaint.sender.name}`}
                {query['complaints-tab'] == COMPLAINTS_TABS.SENT_COMPLAINTS &&
                  `إلى ${USER_RANK_LABELS[complaint.receiver.role]}: ${complaint.receiver.name}`}
              </Text>
            </Group>

            <Group gap={6}>
              <ThemeIcon size='sm' variant='light' color='grape'>
                <FileText size={14} />
              </ThemeIcon>
              <Text size='sm' fw={600}>
                العنوان: {complaint.title}
              </Text>
            </Group>
          </Stack>

          {isOwner &&
            (role === USER_TYPE.DISPLACED ||
              query['complaints-tab'] === COMPLAINTS_TABS.SENT_COMPLAINTS) &&
            role !== USER_TYPE.MANAGER && (
              <CommonDeleteComplaint
                complaint_Id={complaint.id}
                actor_Id={actor_Id}
                role={role}
              />
            )}
        </Group>
      </Card>

      <CommonComplaintModal
        complaint={complaint}
        actor_Id={actor_Id}
        role={role}
        opened={opened}
        close={close}
      />
    </>
  );
}
