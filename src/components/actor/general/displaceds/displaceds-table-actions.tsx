'use client';

import { cn } from '@/utils/cn';
import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import {
  EllipsisVertical,
  Eye,
  Hammer,
  UserCheck,
  Trash2,
  Phone,
  RefreshCcw,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { getDisplacedRoutes } from '@/constants/routes';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { USER_TYPE } from '@/constants/user-types';
import ChangeDelegateInDisplacedsModal from '../../common/modals/change-delegate-in-displaceds-modal';
import DeleteUsersModal from '../../common/modals/delete-users-modal';
import SendUsersActionModal from '../../common/modals/send-users-action-request-modal';
import UpdateUsersModal from '../../common/modals/update-users-modal';
import { NotificationActions } from '@/types/actor/common/index.type';

interface IActionItem {
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  action: () => void;
  type: NotificationActions;
}

interface DisplacedTableActionsProps {
  displacedId?: string;
  displacedIds?: string[];
  disabled?: boolean;
}

export default function DisplacedTableActions({
  displacedId,
  displacedIds,
  disabled,
}: DisplacedTableActionsProps) {
  const { isDelegate, isManager, isSecurityPerson, isSecurityOfficer } = useAuth();
  const [openedPopover, setOpenedPopover] = useState(false);
  const [modalType, setModalType] = useState<NotificationActions | null>(null);

  const router = useRouter();

  const openModal = (type: NotificationActions) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const buildRoute = (id: string, edit = false) => {
    const base = getDisplacedRoutes({ displacedId: id });
    return edit ? `${base.PROFILE}?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}` : base.PROFILE;
  };

  const commonActions: IActionItem[] = [
    {
      label: 'حذف',
      icon: Trash2,
      action: () => openModal(NotificationActions.DELETE),
      type: NotificationActions.DELETE,
    },
    {
      label: 'استدعاء',
      icon: Phone,
      action: () => openModal(NotificationActions.CALL),
      type: NotificationActions.CALL,
    },
    {
      label: 'تحديث بيانات',
      icon: RefreshCcw,
      action: () => openModal(NotificationActions.UPDATE),
      type: NotificationActions.UPDATE,
    },
    {
      label: 'اجتماع',
      icon: Calendar,
      action: () => openModal(NotificationActions.MEETING),
      type: NotificationActions.MEETING,
    },
  ];

  const managerExtras: IActionItem[] = [
    {
      label: 'تغيير المندوب',
      icon: UserCheck,
      action: () => openModal(NotificationActions.CHANGE_DELEGATE),
      type: NotificationActions.CHANGE_DELEGATE,
    },
  ];

  const viewEditActions: IActionItem[] = [
    {
      label: 'عرض',
      icon: Eye,
      action: () => router.push(buildRoute(displacedId || '')),
      type: NotificationActions.EDIT,
    },
    {
      label: 'تعديل',
      icon: Eye,
      action: () => router.push(buildRoute(displacedId || '', true)),
      type: NotificationActions.EDIT,
    },
  ];

  const securityActions: IActionItem[] = [
    {
      label: 'عرض',
      icon: Eye,
      action: () => router.push(buildRoute(displacedId || '')),
      type: NotificationActions.EDIT,
    },
    {
      label: 'استدعاء',
      icon: Phone,
      action: () => openModal(NotificationActions.CALL),
      type: NotificationActions.CALL,
    },
  ];

  const getActions = (): IActionItem[] => {
    if (isManager && displacedIds) return [...commonActions, ...managerExtras];
    if (isManager && displacedId) return [...viewEditActions, ...commonActions, ...managerExtras];
    if (isDelegate && displacedIds) return [...commonActions];
    if (isDelegate && displacedId) return [...viewEditActions, ...commonActions];
    if (isSecurityPerson || isSecurityOfficer) return securityActions;
    return [];
  };

  const ACTIONS = getActions();
  const IDs = displacedIds || (displacedId ? [displacedId] : []);

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
          {displacedIds ? (
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

      {isManager && (
        <ChangeDelegateInDisplacedsModal
          displacedIds={IDs}
          opened={modalType === NotificationActions.CHANGE_DELEGATE}
          close={closeModal}
        />
      )}

      {(isDelegate || isManager) && (
        <DeleteUsersModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          opened={modalType === NotificationActions.DELETE}
          close={closeModal}
        />
      )}

      <SendUsersActionModal
        userIds={IDs}
        userType={USER_TYPE.DISPLACED}
        action='CALL'
        opened={modalType === NotificationActions.CALL}
        close={closeModal}
      />

      {(isDelegate || isManager) && (
        <UpdateUsersModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          opened={modalType === NotificationActions.UPDATE}
          close={closeModal}
        />
      )}

      {(isDelegate || isManager) && (
        <SendUsersActionModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          action='MEETING'
          opened={modalType === NotificationActions.MEETING}
          close={closeModal}
        />
      )}
    </>
  );
}
