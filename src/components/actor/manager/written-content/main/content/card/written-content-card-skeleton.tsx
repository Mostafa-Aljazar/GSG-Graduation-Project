import { Box, Flex, Group, Skeleton, Stack } from '@mantine/core';

export default function WrittenContentCardSkeleton() {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      justify='flex-start'
      align='flex-start'
      wrap='nowrap'
      p={0}
      gap={0}
      w='100%'
      className='bg-white shadow-lg rounded-md overflow-hidden'
    >
      <Box
        pos='relative'
        w={{ base: '100%', sm: 250, md: 300 }}
        h={{ base: 150, sm: 180, md: 200 }}
      >
        <Skeleton width='100%' height='100%' />
      </Box>

      <Stack
        flex={1}
        gap={10}
        align='flex-start'
        justify='space-between'
        w='100%'
        h='100%'
        py={{ base: 10, sm: 15, md: 20 }}
        px={{ base: 15, sm: 20 }}
      >
        <Group w='100%' justify='space-between' align='center'>
          <Skeleton height={10} width={80} />
          <Skeleton height={20} width={25} radius='xl' />
        </Group>

        <Stack flex={1} gap={8} w='100%'>
          <Skeleton height={20} width='80%' />
          <Skeleton height={16} width='100%' />
          <Skeleton height={16} width='90%' />
        </Stack>

        <Skeleton height={30} width={100} className='self-end! rounded-r-none! rounded-l-md!' />
      </Stack>
    </Flex>
  );
}
