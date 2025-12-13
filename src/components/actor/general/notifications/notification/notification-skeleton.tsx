import { Group, Paper, Skeleton, Stack } from '@mantine/core';

export default function Notification_Skeleton() {
  return (
    <Paper p='md' radius='md' withBorder shadow='xs' bg='gray.0' style={{ cursor: 'wait' }}>
      <Group align='flex-start' wrap='nowrap'>
        <Skeleton height={48} width={48} radius={999} />

        <Stack flex={1} gap={4}>
          <Group justify='space-between' align='center' wrap='wrap'>
            <Skeleton height={16} width='25%' radius='sm' />
            <Skeleton height={12} width='10%' radius='sm' />
          </Group>

          <Skeleton height={12} width='35%' radius='sm' />
        </Stack>
      </Group>
    </Paper>
  );
}
