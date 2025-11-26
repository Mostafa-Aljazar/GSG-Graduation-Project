'use client';

import { Box, Flex, Stack, Skeleton, Divider, ThemeIcon } from '@mantine/core';
import { Calendar } from 'lucide-react';

export default function WrittenContentCardSkeleton() {
  return (
    <Box className='w-full'>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='stretch'
        className='bg-white shadow-md! rounded-lg! md:h-[200px]! overflow-hidden animate-pulse'
      >
        <Box w={{ base: '100%', md: 280 }} h={{ base: 180, md: 200 }} pos='relative'>
          <Skeleton height='100%' width='100%' radius={0} />
        </Box>

        <Stack flex={1} justify='space-between' p={20} gap='xs' h={{ base: 180, md: 200 }}>
          <Flex align='center' gap={6} c='dimmed' fz={12}>
            <ThemeIcon variant='light' radius='xl' size={22} color='gray'>
              <Calendar size={14} />
            </ThemeIcon>
            <Skeleton width={60} height={10} />
          </Flex>

          <Skeleton height={20} width='80%' radius='sm' />

          <Skeleton height={16} width='100%' radius='sm' />
          <Skeleton height={16} width='100%' radius='sm' visibleFrom='md' />

          <Divider />

          <Skeleton height={30} width={80} radius='md' />
        </Stack>
      </Flex>
    </Box>
  );
}
