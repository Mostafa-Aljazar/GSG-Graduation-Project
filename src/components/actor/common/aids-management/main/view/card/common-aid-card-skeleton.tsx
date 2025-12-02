import { Stack, Group, Skeleton } from '@mantine/core';

export default function CommonAidCardSkeleton() {
  return (
    <Stack p='md' className='bg-gray-100 border border-gray-200 rounded-lg'>
      <Group>
        <Skeleton height={48} width={48} circle />
        <Stack flex={1} gap={5}>
          <Group justify='space-between'>
            <Skeleton height={16} width='40%' radius='sm' />
            <Group>
              <Skeleton height={12} width={60} radius='sm' />
              <Skeleton height={24} width={24} radius='sm' />
            </Group>
          </Group>
          <Group gap={5}>
            <Skeleton height={15} width={15} circle />
            <Skeleton height={14} width='30%' radius='sm' />
          </Group>
          <Skeleton height={14} width='60%' radius='sm' />
        </Stack>
      </Group>
    </Stack>
  );
}
