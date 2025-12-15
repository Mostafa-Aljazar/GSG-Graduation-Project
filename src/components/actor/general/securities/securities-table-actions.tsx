'use client';

import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import { EllipsisVertical, Hammer, Speech, Trash, UserCog, UserPen, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentType, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { getSecurityRoutes } from '@/constants/routes';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import DeleteUsersModal from '../../common/modals/delete-users-modal';
import SendUsersActionModal from '../../common/modals/send-users-action-request-modal';
import UpdateUsersModal from '../../common/modals/update-users-modal';
import { USER_TYPE } from '@/constants/user-types';

export enum SecurityActions {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  CALL = 'CALL',
  UPDATE = 'UPDATE',
  MEETING = 'MEETING',
}

export const SecurityActionsIcons: Record<
  SecurityActions,
  ComponentType<{ size?: number | string }>
> = {
  [SecurityActions.EDIT]: UserPen,
  [SecurityActions.DELETE]: Trash,
  [SecurityActions.CALL]: Speech,
  [SecurityActions.UPDATE]: UserCog,
  [SecurityActions.MEETING]: Users,
};

interface ActionItem {
  label: string;
  type: SecurityActions;
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
  const [modalType, setModalType] = useState<SecurityActions | null>(null);

  const openModal = (type: SecurityActions) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const buildRoute = (id: string, edit = false) => {
    const base = getSecurityRoutes({ securityId: id });
    return edit ? `${base.PROFILE}?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}` : base.PROFILE;
  };

  const commonActions: ActionItem[] = [
    { label: 'حذف', type: SecurityActions.DELETE, action: () => openModal(SecurityActions.DELETE) },
    { label: 'استدعاء', type: SecurityActions.CALL, action: () => openModal(SecurityActions.CALL) },
    {
      label: 'تحديث بيانات',
      type: SecurityActions.UPDATE,
      action: () => openModal(SecurityActions.UPDATE),
    },
    {
      label: 'اجتماع',
      type: SecurityActions.MEETING,
      action: () => openModal(SecurityActions.MEETING),
    },
  ];

  const viewEditActions: ActionItem[] = [
    {
      label: 'عرض',
      type: SecurityActions.EDIT,
      action: () => router.push(buildRoute(securityId || '')),
    },
    {
      label: 'تعديل',
      type: SecurityActions.EDIT,
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

  const DropdownItems = ACTIONS.map((item, index) => {
    const Icon = SecurityActionsIcons[item.type];
    return (
      <Button
        key={item.label}
        justify='flex-start'
        leftSection={
          <ThemeIcon variant='transparent' className='text-dark'>
            <Icon size={16} />
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
    );
  });

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
            opened={modalType === SecurityActions.DELETE}
            close={closeModal}
          />

          <SendUsersActionModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            action='CALL'
            opened={modalType === SecurityActions.CALL}
            close={closeModal}
          />

          <SendUsersActionModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            action='MEETING'
            opened={modalType === SecurityActions.MEETING}
            close={closeModal}
          />

          <UpdateUsersModal
            userIds={IDs}
            userType={USER_TYPE.SECURITY_PERSON}
            opened={modalType === SecurityActions.UPDATE}
            close={closeModal}
          />
        </>
      )}
    </>
  );
}
