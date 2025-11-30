'use client';

import { Card, Center, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ITask } from '@/types/actor/security/tasks/TasksResponse.type';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { formatDate } from '@/utils/formatDate';
import SecurityTaskActions from './security-task-actions';
import ViewTaskModal from './modal/view-task-modal';

interface ISecurityTasksCardProps {
  task: ITask;
}

export default function SecurityTasksCard({ task }: ISecurityTasksCardProps) {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const isCompleted = task.type === TASKS_TABS.COMPLETED_TASKS;
  const taskIcon = isCompleted ? <CheckCircle2 size={18} /> : <Clock size={18} />;
  const taskColor = isCompleted ? 'green' : 'red';

  const formattedDate = task.dateTime ? formatDate(new Date(task.dateTime), 'yyyy-MM-dd') : '';
  const formattedTime = task.dateTime ? formatDate(new Date(task.dateTime), 'HH:mm') : '';

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // إضافة هذه السطر لمنع تصاعد الحدث
    // Prevent modal open if clicked inside action area (identified by data-click="action" or class includes "action")
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    const clickedOnAction = path.some((el) => {
      if (!(el instanceof HTMLElement)) return false;
      return el.getAttribute('data-click') === 'action' || el.classList.contains('action');
    });

    if (!clickedOnAction) openModal();
  };

  return (
    <>
      <Card
        p={{ base: 'sm', md: 'md' }}
        radius='lg'
        shadow='sm'
        withBorder
        onClick={handleOpenModal}
        className={cn(isCompleted ? 'bg-gray-100!' : 'bg-red-50!')}
        style={{ cursor: 'pointer' }}
      >
        <Group align='center' gap='sm' wrap='nowrap'>
          <Center>
            <ThemeIcon size='lg' radius='xl' variant='light' color={taskColor}>
              {taskIcon}
            </ThemeIcon>
          </Center>

          <Group w='100%' justify='space-between'>
            <Stack flex={1} gap={3}>
              <Text size='xs' c='dimmed'>
                {formattedDate} - {formattedTime}
              </Text>
              <Text fz={14} fw={600} className='text-primary'>
                العنوان: {task.title}
              </Text>

              <Text fz={14} fw={500} c='dimmed' lh={1.6}>
                {task.body}
              </Text>
            </Stack>

            <SecurityTaskActions task={task} />
          </Group>
        </Group>
      </Card>

      <ViewTaskModal opened={modalOpened} onClose={closeModal} task={task} />
    </>
  );
}
