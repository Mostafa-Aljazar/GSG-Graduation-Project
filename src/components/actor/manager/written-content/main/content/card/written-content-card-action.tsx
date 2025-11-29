'use client';

import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Edit, Eye, Trash } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ACTION_ADD_EDIT_DISPLAY, TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { getManagerRoutes } from '@/constants/routes';
import WrittenContentDeleteModal from './written-content-delete-modal';

interface ActionItem {
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  action: () => void;
}

interface IWrittenContentCardActionProps {
  writtenContentId: number;
  type: TYPE_WRITTEN_CONTENT;
  managerId: number;
}

export default function WrittenContentCardAction({
  writtenContentId,
  type = TYPE_WRITTEN_CONTENT.ADS,
  managerId,
}: IWrittenContentCardActionProps) {
  const [openedPopover, setOpenedPopover] = useState(false);

  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const router = useRouter();

  const ACTIONS: ActionItem[] = [
    {
      label: 'عرض',
      icon: Eye,
      action: () =>
        router.push(
          getManagerRoutes({
            managerId: managerId,
            writtenContent: {
              id: writtenContentId,
              type: type,
            },
          }).WRITTEN_CONTENT
        ),
    },
    {
      label: 'تعديل',
      icon: Edit,
      action: () =>
        router.push(
          getManagerRoutes({
            managerId: managerId,
            writtenContent: {
              id: writtenContentId,
              type: type,
            },
          }).ADD_WRITTEN_CONTENT +
            `?action=${ACTION_ADD_EDIT_DISPLAY.EDIT}&id=${writtenContentId}&written-tab=${type}`
        ),
    },
    {
      label: 'حذف',
      icon: Trash,
      action: () => openDelete(),
    },
  ];

  const DropdownItems = ACTIONS.map((item, index) => (
    <Button
      key={item.label}
      justify='flex-start'
      leftSection={
        <ThemeIcon variant='transparent' className='text-dark!'>
          <item.icon size={16} />
        </ThemeIcon>
      }
      p={10}
      bg='transparent'
      fz={15}
      fw={400}
      className={cn(
        'hover:bg-gray-100! rounded-none! text-dark! transition-all',
        index < ACTIONS.length - 1 && '  border-b! border-b-gray-300!'
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
        width={130}
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
            data-click='popover'
            bg='transparent'
            mt={5}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              setOpenedPopover((o) => !o);
            }}
          >
            <EllipsisVertical size={16} className='mx-auto text-primary' />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown p={0} className='bg-gray-200! border-none!'>
          <Stack justify='flex-start' gap={0}>
            {DropdownItems}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <WrittenContentDeleteModal
        id={writtenContentId}
        close={closeDelete}
        opened={openedDelete}
        type={type}
        managerId={managerId}
      />
    </>
  );
}
