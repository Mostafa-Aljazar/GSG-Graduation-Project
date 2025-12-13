'use client';

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
import { cn } from '@/utils/cn';
import { getSecurityRoutes } from '@/constants/routes';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import DeleteUsersModal from '../../common/modals/delete-users-modal';
import { USER_TYPE } from '@/constants/user-types';
import SendUsersActionModal from '../../common/modals/send-users-action-request-modal';
import UpdateUsersModal from '../../common/modals/update-users-modal';

interface ActionItem {
  label: string;
  icon: ComponentType<{ size?: number | string }>;
  action: () => void;
}

interface Props {
  securityId?: string;
  securityIds?: string[];
  disabled?: boolean;
}

export default function SecuritiesTableActions({ securityId, securityIds, disabled }: Props) {
  const { isManager, isSecurityOfficer } = useAuth();
  const router = useRouter();

  const [openedPopover, setOpenedPopover] = useState(false);
  const [modalType, setModalType] = useState<
    'edit' | 'delete' | 'call' | 'update' | 'meeting' | null
  >(null);

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const buildRoute = (id: string, edit = false) => {
    const base = getSecurityRoutes({ securityId: id });
    return edit ? `${base.PROFILE}?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}` : base.PROFILE;
  };

  // Common actions for manager/officer
  const commonActions: ActionItem[] = [
    { label: 'حذف', icon: Trash, action: () => openModal('delete') },
    { label: 'استدعاء', icon: Speech, action: () => openModal('call') },
    { label: 'تحديث بيانات', icon: UserCog, action: () => openModal('update') },
    { label: 'اجتماع', icon: Users, action: () => openModal('meeting') },
  ];

  // View/edit actions
  const viewEditActions: ActionItem[] = [
    { label: 'عرض', icon: Eye, action: () => router.push(buildRoute(securityId || '')) },
    {
      label: 'تعديل',
      icon: UserPen,
      action: () => router.push(buildRoute(securityId || '', true)),
    },
  ];

  const getActions = (): ActionItem[] => {
    if ((isManager || isSecurityOfficer) && securityIds) return [...commonActions];
    if ((isManager || isSecurityOfficer) && securityId)
      return [...viewEditActions, ...commonActions];
    return [];
  };

  const ACTIONS = getActions();
  const IDs = securityIds || (securityId ? [securityId] : []);

  const DropdownItems = ACTIONS.map((item, index) => (
    <Button
      key={item.label}
      justify='flex-start'
      leftSection={
        <ThemeIcon variant='transparent' className='text-dark'>
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
          {securityIds ? (
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
            {DropdownItems}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      {(isManager || isSecurityOfficer) && (
        <>
          <DeleteUsersModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            opened={modalType === 'delete'}
            close={closeModal}
          />

          <SendUsersActionModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            action='call'
            opened={modalType === 'call'}
            close={closeModal}
          />

          <SendUsersActionModal
            userIds={IDs}
            userType={USER_TYPE.DELEGATE}
            action='meeting'
            opened={modalType === 'meeting'}
            close={closeModal}
          />

          <UpdateUsersModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            opened={modalType === 'update'}
            close={closeModal}
          />
        </>
      )}
    </>
  );
}
