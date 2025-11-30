import SecurityTasksFeed from '@/components/actor/security/tasks/security-tasks-feed';
import SecurityTasksHeaderTabs from '@/components/actor/security/tasks/security-tasks-tabs';
import { Stack } from '@mantine/core';

export default async function Security_Tasks() {
  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'} px={10}>
      <SecurityTasksHeaderTabs />

      <SecurityTasksFeed />
    </Stack>
  );
}
