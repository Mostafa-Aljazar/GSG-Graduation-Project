'use client';

import { cn } from '@/utils/cn';
import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import { EllipsisVertical, Eye, Trash, UserPen, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useDisclosure } from '@mantine/hooks';
import { parseAsStringEnum, useQueryStates } from 'nuqs';
import { DISTRIBUTION_MECHANISM, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';
import { getDelegateRoutes, getManagerRoutes } from '@/constants/routes';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import CommonAidDeleteModal from './common-aid-delete-modal';

interface IActionItem {
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  action: () => void;
}

interface ICommonAidActionProps {
  aidId: string;
  aidDistributionMechanism: DISTRIBUTION_MECHANISM;
}

export default function CommonAidAction({
  aidId,
  aidDistributionMechanism,
}: ICommonAidActionProps) {
  const { userId: actorId, userType: role } = useAlreadyUserStore();
  const [query] = useQueryStates({
    'aids-tab': parseAsStringEnum<TYPE_GROUP_AIDS>(Object.values(TYPE_GROUP_AIDS)).withDefault(
      TYPE_GROUP_AIDS.ONGOING_AIDS
    ),
  });

  const { user, isManager, isDelegate } = useAuth();
  const [openedPopover, setOpenedPopover] = useState(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const router = useRouter();
  const isOwner = actorId === user?.id && user.role == role;

  const routeFunc =
    role === USER_TYPE.MANAGER
      ? getManagerRoutes({ managerId: actorId, aidId })
      : getDelegateRoutes({ delegateId: actorId, aidId });

  const ACTIONS: IActionItem[] = (() => {
    // Manager owns this aid → can view, edit, delete
    if (isManager && isOwner) {
      if (query['aids-tab'] === TYPE_GROUP_AIDS.COMING_AIDS) {
        return [
          {
            label: 'عرض',
            icon: Eye,
            action: () => router.push(routeFunc.AID),
          },
          {
            label: 'تعديل',
            icon: UserPen,
            action: () =>
              router.push(
                `${getManagerRoutes({ managerId: actorId, aidId }).ADD_AID}?action=${
                  ACTION_ADD_EDIT_DISPLAY.EDIT
                }&aidId=${aidId}`
              ),
          },
          { label: 'حذف', icon: Trash, action: openDelete },
        ];
      } else {
        return [
          {
            label: 'عرض',
            icon: Eye,
            action: () => router.push(routeFunc.AID),
          },
          { label: 'حذف', icon: Trash, action: openDelete },
        ];
      }
    }

    if (role === USER_TYPE.MANAGER && isManager && !isOwner) {
      return [{ label: 'عرض', icon: Eye, action: () => router.push(routeFunc.AID) }];
    }

    if (isDelegate && isOwner) {
      if (
        aidDistributionMechanism === DISTRIBUTION_MECHANISM.DELEGATES_LISTS &&
        query['aids-tab'] === TYPE_GROUP_AIDS.COMING_AIDS
      ) {
        return [
          {
            label: 'عرض',
            icon: Eye,
            action: () => router.push(routeFunc.AID),
          },
          {
            label: 'إضافة نازحين',
            icon: UserPlus,
            action: () =>
              router.push(getDelegateRoutes({ delegateId: actorId, aidId }).ADD_AID_DISPLACEDS),
          },
        ];
      } else {
        return [
          {
            label: 'عرض',
            icon: Eye,
            action: () => router.push(routeFunc.AID),
          },
        ];
      }
    }

    return [];
  })();

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
      onClick={(e) => {
        e.stopPropagation();
        item.action();
        setOpenedPopover(false);
      }}
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
          <ActionIcon
            bg='transparent'
            mt={5}
            onClick={(e) => {
              e.stopPropagation();
              setOpenedPopover((o) => !o);
            }}
          >
            <EllipsisVertical size={20} className='text-primary' />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown p={0} className='bg-gray-200! border-none!'>
          <Stack justify='flex-start' gap={0}>
            {DropdownItems}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <CommonAidDeleteModal aidId={aidId} opened={openedDelete} close={closeDelete} />
    </>
  );
}
