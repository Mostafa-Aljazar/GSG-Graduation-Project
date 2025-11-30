'use client';

import { Stack, Text, Flex, Pagination, Center } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { parseAsInteger, useQueryStates } from 'nuqs';
import Security_Task_Skeleton from './task/security-task-skeleton';
import { ITask } from '@/types/actor/security/tasks/TasksResponse.type';
import SecurityTasksCard from './task/security-task-card';

interface ISecurityTasksListProps {
  tasks: ITask[];
  totalPages: number;
  limit: number;
  loading: boolean;
}

export default function Security_Tasks_List({
  tasks,
  totalPages,
  limit,
  loading,
}: ISecurityTasksListProps) {
  const [query, setQuery] = useQueryStates({
    'tasks-page': parseAsInteger.withDefault(1),
  });

  return (
    <Stack pos={'relative'}>
      {loading ? (
        <Stack gap='xs'>
          {Array.from({ length: limit }).map((_, index) => (
            <Security_Task_Skeleton key={index} />
          ))}
        </Stack>
      ) : tasks.length === 0 ? (
        <Center mt={30} mih={200} className='bg-gray-50 p-6 border border-gray-200 rounded-md'>
          <Stack align='center' gap={6}>
            <MessageCircleWarning size={40} className='text-primary' />
            <Text fw={600} fz='lg' className='text-primary'>
              لا توجد مهام لعرضها
            </Text>
          </Stack>
        </Center>
      ) : (
        <Stack gap='xs'>
          {tasks.map((task, index) => (
            <SecurityTasksCard key={index} task={task} />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Flex justify='center' mt='xl'>
          <Pagination
            value={query['tasks-page']}
            onChange={(value: number) => setQuery({ 'tasks-page': value })}
            total={totalPages}
            size='sm'
            radius='xl'
            withControls={false}
            mx='auto'
            classNames={{
              dots: '!rounded-full !text-gray-300 border-1',
              control: '!rounded-full',
            }}
          />
        </Flex>
      )}
    </Stack>
  );
}
