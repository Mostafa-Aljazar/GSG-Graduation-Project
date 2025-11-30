'use client';

import { useQuery } from '@tanstack/react-query';
import { Box, Button, Center, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import SecurityTasksList from './security-tasks-list';
import { useDisclosure } from '@mantine/hooks';
import { CalendarCheck, MessageCircleWarning } from 'lucide-react';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { ITasksResponse } from '@/types/actor/security/tasks/TasksResponse.type';
import { getSecurityTasks } from '@/actions/actor/securities/tasks/getSecurityTasks';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import TaskFormModal from './task/modal/task-form-modal';

export default function SecurityTasksFeed() {
  const { userId: securityId } = useAlreadyUserStore();
  const [query] = useQueryStates({
    'tasks-tab': parseAsStringEnum<TASKS_TABS>(Object.values(TASKS_TABS)).withDefault(
      TASKS_TABS.COMPLETED_TASKS
    ),
    'tasks-page': parseAsInteger.withDefault(1),
  });

  const [opened, { open, close }] = useDisclosure(false);

  const limit = 7;

  const {
    data: tasksData,
    isLoading,
    error,
  } = useQuery<ITasksResponse>({
    queryKey: ['security-tasks', query, securityId],
    queryFn: () =>
      getSecurityTasks({
        page: query['tasks-page'],
        limit,
        taskType: query['tasks-tab'],
      }),
  });

  if (!securityId) {
    return <Text c='red'>لا يمكن تحميل المهام، لم يتم تحديد هوية المستخدم.</Text>;
  }

  const hasError = Boolean(error) || Boolean(tasksData?.error);

  return (
    <Box dir='rtl' w='100%' p='sm'>
      <Group justify='end' mb='sm'>
        <Button
          onClick={open}
          size='sm'
          rightSection={<CalendarCheck size={18} />}
          className='bg-primary! shadow-md font-semibold text-white'
        >
          إضافة مهمة
        </Button>
      </Group>

      {hasError ? (
        <Paper p='md' withBorder className='bg-red-100! rounded-md text-center'>
          <Center mb='sm'>
            <ThemeIcon color='red' variant='light' size='lg'>
              <MessageCircleWarning />
            </ThemeIcon>
          </Center>
          <Text c='red' fw={600}>
            {tasksData?.error || error?.message || 'حدث خطأ أثناء جلب المهام'}
          </Text>
        </Paper>
      ) : (
        <SecurityTasksList
          tasks={tasksData?.tasks || []}
          totalPages={tasksData?.pagination.totalPages || 1}
          limit={tasksData?.pagination.limit || limit}
          loading={isLoading}
        />
      )}

      <TaskFormModal opened={opened} onClose={close} />
    </Box>
  );
}
