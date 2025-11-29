import { Paper, Skeleton, Stack } from '@mantine/core';

export default function AdSkeleton() {
  return (
    <Paper p='md' radius='md' withBorder shadow='xs' bg='gray.0' style={{ cursor: 'wait' }}>
      <Skeleton height={120} radius='sm' mb='sm' />
      <Stack p='sm'>
        <Skeleton height={12} width='60%' radius='xl' mb={4} />
        <Skeleton height={10} width='90%' radius='xl' />
      </Stack>
    </Paper>
  );
}
