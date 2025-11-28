'use client';

import { cn } from '@/utils/cn';
import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import {
  EllipsisVertical,
  Eye,
  Hammer,
  Speech,
  Trash,
  UserCog,
  UserPen,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentType, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { getDelegateRoutes } from '@/constants/routes';
import DeleteDelegateModal from './modals/delete-delegate-modal';
import MeetingDelegateModal from './modals/meeting-delegate-modal';
import UpdateDelegateModal from './modals/update-delegate-modal';
import CallDelegateModal from './modals/call-delegate-modal';

interface IActionItem {
  label: string;
  icon: ComponentType<{ size?: number | string }>;
  action: () => void;
}

interface Props {
  delegateId?: number;
  delegateIds?: number[];
  disabled?: boolean;
}

export default function DelegatesTableActions({ delegateId, delegateIds, disabled }: Props) {
  const { isManager, isSecurityPerson, isSecurityOfficer } = useAuth();
  const [openedPopover, setOpenedPopover] = useState(false);
  const [modalType, setModalType] = useState<
    'edit' | 'delete' | 'call' | 'update' | 'meeting' | null
  >(null);

  const router = useRouter();

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const buildRoute = (id: number, edit = false) => {
    const base = getDelegateRoutes({ delegateId: id });
    return edit ? `${base.PROFILE}?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}` : base.PROFILE;
  };

  const commonActions: IActionItem[] = [
    { label: 'حذف', icon: Trash, action: () => openModal('delete') },
    { label: 'استدعاء', icon: Speech, action: () => openModal('call') },
    { label: 'تحديث بيانات', icon: UserCog, action: () => openModal('update') },
    { label: 'اجتماع', icon: Users, action: () => openModal('meeting') },
  ];

  const viewEditActions: IActionItem[] = [
    {
      label: 'عرض',
      icon: Eye,
      action: () => router.push(buildRoute(delegateId || 0)),
    },
    {
      label: 'تعديل',
      icon: UserPen,
      action: () => router.push(buildRoute(delegateId || 0, true)),
    },
  ];

  const securityActions: IActionItem[] = [
    {
      label: 'عرض',
      icon: Eye,
      action: () => router.push(buildRoute(delegateId || 0)),
    },
    { label: 'استدعاء', icon: Speech, action: () => openModal('call') },
  ];

  const getActions = (): IActionItem[] => {
    if (isManager && delegateIds) return [...commonActions];
    if (isManager && delegateId) return [...viewEditActions, ...commonActions];
    if (isSecurityPerson || isSecurityOfficer) return securityActions;
    return [];
  };

  const ACTIONS = getActions();
  const IDs = delegateIds || (delegateId ? [delegateId] : []);

  const Dropdown_Items = ACTIONS.map((item, index) => (
    <Button
      key={item.label}
      justify='flex-start'
      leftSection={
        <ThemeIcon variant='transparent' className='text-dark!'>
          <item.icon size={16} />
        </ThemeIcon>
      }
      p={0}
      bg='transparent'
      fz={16}
      fw={500}
      className={cn(
        'hover:bg-second-light! rounded-none! text-dark!',
        index + 1 !== ACTIONS.length && 'border-gray-100! border-0! border-b!'
      )}
      onClick={item.action}
    >
      {item.label}
    </Button>
  ));

  return (
    <>
      <Popover
        width={150}
        opened={openedPopover}
        onChange={setOpenedPopover}
        position='left-start'
        withArrow
        arrowPosition='center'
        arrowSize={12}
        arrowRadius={3}
        arrowOffset={10}
        classNames={{ arrow: '!border-none' }}
      >
        <Popover.Target>
          {delegateIds ? (
            <Button
              type='button'
              w={130}
              size='sm'
              px={15}
              fz={16}
              fw={500}
              c='white'
              radius='md'
              className='justify-end! items-end! self-end! bg-primary! shadow-lg!'
              rightSection={<Hammer size={15} />}
              disabled={disabled}
              onClick={() => setOpenedPopover((o) => !o)}
            >
              العمليات
            </Button>
          ) : (
            <ActionIcon bg='transparent' mt={5} onClick={() => setOpenedPopover((o) => !o)}>
              <EllipsisVertical size={20} className='mx-auto text-primary' />
            </ActionIcon>
          )}
        </Popover.Target>
        <Popover.Dropdown p={0} className='bg-gray-200! border-none!'>
          <Stack justify='flex-start' gap={0}>
            {Dropdown_Items}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      {isManager && (
        <DeleteDelegateModal delegateIds={IDs} opened={modalType === 'delete'} close={closeModal} />
      )}

      <CallDelegateModal delegateIds={IDs} opened={modalType === 'call'} close={closeModal} />

      <UpdateDelegateModal delegateIds={IDs} opened={modalType === 'update'} close={closeModal} />

      <MeetingDelegateModal delegateIds={IDs} opened={modalType === 'meeting'} close={closeModal} />
    </>
  );
}
