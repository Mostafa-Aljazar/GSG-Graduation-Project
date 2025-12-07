'use client';

import { Box, Card, Flex, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { cn } from '@/utils/cn';
import { IComplaint } from '@/types/actor/general/complaints/complaints-response.type';
import Image from 'next/image';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import man from '@/assets/actor/man.svg';
import { USER_RANK, USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import { COMPLAINTS_STATUS } from '@/types/actor/common/index.type';
import { Calendar, User, FileText, CheckCircle2, Clock } from 'lucide-react';
import { IActionResponse } from '@/types/common/action-response.type';
import {
  changeStatusComplaint,
  IChangeStatusComplaintProps,
} from '@/actions/actor/general/complaints/changeStatusComplaint';
import ComplaintModal from './complaint-modal';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import DeleteComplaint from './delete-complaint';

interface IComplaintCardProps {
  complaint: IComplaint;
}

export default function ComplaintCard({ complaint }: IComplaintCardProps) {
  const { userId: userAlreadyId, userType: userAlreadyType } = useAlreadyUserStore();
  const { user, isDisplaced, isManager } = useAuth();

  const isOwner = user && user.id == userAlreadyId && user?.role == userAlreadyType;

  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation<IActionResponse, unknown, IChangeStatusComplaintProps>({
    mutationFn: changeStatusComplaint,
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

  const canChangeStatus =
    user &&
    complaint.receiver.id == user.id &&
    complaint.receiver.role == user.rank &&
    complaint.status === COMPLAINTS_STATUS.PENDING;

  const handleClick = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    const clickedOnDelete = path.some((el) => {
      const attr = (el as HTMLElement)?.getAttribute?.('data-click');
      const classes = (el as HTMLElement)?.classList?.toString() || '';
      return attr === 'delete' || classes.includes('delete');
    });

    if (!clickedOnDelete) {
      if (canChangeStatus) {
        changeStatusMutation.mutate({
          complaintId: complaint.id,
          actorReceiverId: user.id,
          roleReceiver: user.rank as
            | USER_RANK.SECURITY_OFFICER
            | USER_TYPE.DELEGATE
            | USER_TYPE.MANAGER,
        });
      }
      open();
    }
  };

  ////////////////////////////////////////////

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

  const canDelete =
    isOwner &&
    complaint.sender.id == user.id &&
    (complaint.sender.role == user.role || complaint.sender.role == user.rank);
  ///////////////////////////////////////////
  return (
    <>
      <Card
        key={complaint.id}
        p='md'
        radius='lg'
        shadow='sm'
        className={cn(
          'hover:shadow-md border-gray-300! transition-all cursor-pointer border!',
          complaint.status === COMPLAINTS_STATUS.READ ? 'bg-gray-50!' : 'bg-red-50!'
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
                  {complaint.date.toString()}
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
                {connectionInfo}
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

          {canDelete && <DeleteComplaint complaintId={complaint.id} />}
        </Group>
      </Card>

      <ComplaintModal complaint={complaint} opened={opened} close={close} />
    </>
  );
}
