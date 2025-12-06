import { Group, Paper, Skeleton, Stack } from '@mantine/core';

export default function DisplacedReceivedAidSkeleton() {
  return (
    <Paper withBorder radius='md' p='md' bg='gray.0' className='shadow-sm w-full'>
      <Group gap='sm'>
        <Skeleton height={40} width={40} circle />
        <Stack gap={6} flex={1}>
          <Skeleton height={12} width='60%' radius='xl' />
          <Skeleton height={10} width='40%' radius='xl' />
        </Stack>
      </Group>
    </Paper>
  );
}
