'use client';
import { IMG_MAN } from '@/assets/actor';
import { USER_RANK, USER_RANK_LABELS } from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import { Box, Group, Skeleton, Stack, Text } from '@mantine/core';
import { IdCard } from 'lucide-react';
import Image from 'next/image';

export default function ProfileInfo() {
  const { user } = useAuth();
  const isLoading = user ? false : true;

  return (
    <Stack
      w='100%'
      justify='center'
      align='center'
      gap={10}
      pb={10}
      className='bg-white shadow-xl! rounded-[20px]! overflow-hidden!'
    >
      <Box
        w='100%'
        h={70}
        className='bg-linear-to-b! from-primary! to-white! rounded-[20px]! relative!'
      >
        <Box
          pos='absolute'
          bottom='-50%'
          left='50%'
          className='bg-primary rounded-full! overflow-hidden! -translate-x-1/2!'
          w={85}
          h={85}
        >
          {isLoading ? (
            <Skeleton width={85} height={85} radius='50%' />
          ) : (
            <Image
              src={user?.profileImage || IMG_MAN}
              alt='Profile'
              width={85}
              height={85}
              className='object-cover!'
            />
          )}
        </Box>
      </Box>

      <Stack mt={30} align='center' gap={8}>
        {isLoading ? (
          <>
            <Skeleton height={20} width={150} />
            <Skeleton height={16} width={100} />
          </>
        ) : (
          <>
            <Text fw={600} fz={16} ta='right' c='white' className='text-primary!'>
              {`${USER_RANK_LABELS[user?.rank as USER_RANK]} : `}
              {user?.name}
            </Text>

            <Group gap={5}>
              <IdCard size={20} className='text-primary!' />
              <Text fw={600} fz={14} c='white' ta='center' className='text-primary!' dir='ltr'>
                {user?.identity ?? 'لا يوجد رقم هوية'} :
              </Text>
            </Group>
          </>
        )}
      </Stack>
    </Stack>
  );
}
