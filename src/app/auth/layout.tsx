import { ReactNode } from 'react';
import Image from 'next/image';
import { IMG_COVER_CAMP } from '@/assets/auth';
import AuthRightSection from '@/components/auth/auth-right-section';
import { Box, Center, Group, Overlay, Stack } from '@mantine/core';

export default function Auth_Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Desktop */}
      <Box visibleFrom='lg' pos={'relative'} w={'100%'}>
        <Image
          src={IMG_COVER_CAMP}
          alt='coverLogin'
          className='absolute inset-0 w-full h-full object-cover'
          priority
        />
        <Overlay zIndex={40} pos={'absolute'} bg={'black'} opacity={0.5} />
        <Group
          pos={'relative'}
          wrap='nowrap'
          justify='center'
          align='center'
          w={'100%'}
          mih={'100vh'}
          className='z-50!'
        >
          <Center flex={1}>
            <AuthRightSection />
          </Center>
          <Box flex={1} h={550}>
            {children}
          </Box>
        </Group>
      </Box>

      {/* Mobile */}
      <Box hiddenFrom='lg' w={'100%'} mih={'100vh'}>
        <Box pos={'relative'} w={'100%'} className='rounded-b-2xl! overflow-hidden!'>
          <Box w={'100%'} h={285}>
            <Image
              src={IMG_COVER_CAMP}
              alt='Cover Login'
              objectFit='cover'
              className='w-full h-full object-cover'
              priority
            />
          </Box>
          <Stack
            justify='center'
            align='center'
            pos={'absolute'}
            pb={40}
            w={'100%'}
            className='inset-0! bg-black/50'
          >
            <AuthRightSection />
          </Stack>
        </Box>
        <Stack flex={1} justify='center' align='center' w={'100%'} my={20}>
          {children}
        </Stack>
      </Box>
    </>
  );
}
