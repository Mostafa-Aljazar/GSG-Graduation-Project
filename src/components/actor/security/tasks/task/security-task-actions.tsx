'use client';

import { cn } from '@/utils/cn';
import { ActionIcon, Button, Popover, Stack, ThemeIcon } from '@mantine/core';
import { EllipsisVertical, Trash, Pencil } from 'lucide-react';
import { ComponentType, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { ITask } from '@/types/actor/security/tasks/TasksResponse.type';
import DeleteTaskModal from './modal/delete-task-modal';
import TaskFormModal from './modal/task-form-modal';

interface ActionItem {
  label: string;
  icon: ComponentType<{ size?: number | string }>;
  action: () => void;
}

interface SecurityTaskActionProps {
  task: ITask;
}

export default function SecurityTaskActions({ task }: SecurityTaskActionProps) {
  const { isSecurityOfficer } = useAuth();
  const [openedPopover, setOpenedPopover] = useState(false);
  const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null);

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setOpenedPopover(false);
  };

  const closeModal = () => setModalType(null);

  const ACTIONS: ActionItem[] = isSecurityOfficer
    ? [
        {
          label: 'تعديل',
          icon: Pencil,
          action: () => openModal('edit'),
        },
        {
          label: 'حذف',
          icon: Trash,
          action: () => openModal('delete'),
        },
      ]
    : [];

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
      }}
    >
      {item.label}
    </Button>
  ));
  return (
    <>
      <Popover
        data-click='action'
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
            data-click='action'
            bg='transparent'
            mt={5}
            onClick={() => setOpenedPopover((o) => !o)}
          >
            <EllipsisVertical size={20} className='mx-auto text-primary' />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown p={0} className='bg-gray-200! border-none!'>
          <Stack justify='flex-start' gap={0}>
            {DropdownItems}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <DeleteTaskModal taskId={task.id} opened={modalType === 'delete'} close={closeModal} />

      <TaskFormModal opened={modalType === 'edit'} onClose={closeModal} taskToEdit={task} />
    </>
  );
}
