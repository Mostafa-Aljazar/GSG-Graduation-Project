'use client';

import { cn } from '@/utils/cn';
import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import {
  EllipsisVertical,
  Eye,
  Hammer,
  Repeat,
  Speech,
  Trash,
  UserCog,
  UserPen,
  Users,
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

interface IActionItem {
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  action: () => void;
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
  const [modalType, setModalType] = useState<
    'change_delegate' | 'edit' | 'delete' | 'call' | 'update' | 'meeting' | null
  >(null);

  const router = useRouter();

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const buildRoute = (id: string, edit = false) => {
    const base = getDisplacedRoutes({ displacedId: id });
    return edit ? `${base.PROFILE}?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}` : base.PROFILE;
  };

  const commonActions: IActionItem[] = [
    { label: 'حذف', icon: Trash, action: () => openModal('delete') },
    { label: 'استدعاء', icon: Speech, action: () => openModal('call') },
    { label: 'تحديث بيانات', icon: UserCog, action: () => openModal('update') },
    { label: 'اجتماع', icon: Users, action: () => openModal('meeting') },
  ];

  const managerExtras: IActionItem[] = [
    { label: 'تغيير المندوب', icon: Repeat, action: () => openModal('change_delegate') },
  ];

  const viewEditActions: IActionItem[] = [
    { label: 'عرض', icon: Eye, action: () => router.push(buildRoute(displacedId || '')) },
    {
      label: 'تعديل',
      icon: UserPen,
      action: () => router.push(buildRoute(displacedId || '', true)),
    },
  ];

  const securityActions: IActionItem[] = [
    { label: 'عرض', icon: Eye, action: () => router.push(buildRoute(displacedId || '')) },
    { label: 'استدعاء', icon: Speech, action: () => openModal('call') },
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
          opened={modalType === 'change_delegate'}
          close={closeModal}
        />
      )}

      {(isDelegate || isManager) && (
        <DeleteUsersModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          opened={modalType === 'delete'}
          close={closeModal}
        />
      )}

      <SendUsersActionModal
        userIds={IDs}
        userType={USER_TYPE.DISPLACED}
        action='call'
        opened={modalType === 'call'}
        close={closeModal}
      />

      {(isDelegate || isManager) && (
        <UpdateUsersModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          opened={modalType === 'update'}
          close={closeModal}
        />
      )}

      {(isDelegate || isManager) && (
        <SendUsersActionModal
          userIds={IDs}
          userType={USER_TYPE.DISPLACED}
          action='meeting'
          opened={modalType === 'meeting'}
          close={closeModal}
        />
      )}
    </>
  );
}
