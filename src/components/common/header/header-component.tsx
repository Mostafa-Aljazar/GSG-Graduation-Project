'use client';

import { AppShell, Burger, Button, Flex, Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { AUTH_ROUTES, LANDING_ROUTES } from '@/constants/routes';
import { IMG_LOGO } from '@/assets/common';
import HeaderLinks from './header-links';
import HeaderDrawer from './header-drawer';

interface IHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export default function HeaderComponent({ opened, toggle }: IHeaderProps) {
  return (
    <AppShell.Header withBorder={false} zIndex={50} className='bg-second-light! shadow-sm'>
      <Flex justify='space-between' align='center' h='100%' px={{ base: 'md', lg: 'lg' }}>
        <Group gap='md'>
          <Burger opened={opened} onClick={toggle} size='sm' hiddenFrom='lg' />

          <Link href={LANDING_ROUTES.HOME} className='flex items-center'>
            <Image
              src={IMG_LOGO}
              alt='Logo'
              width={54}
              height={54}
              priority
              className='hover:opacity-90 rounded-lg transition-opacity'
            />
          </Link>
        </Group>

        <Group gap={32} visibleFrom='lg'>
          <HeaderLinks />
        </Group>

        <Group gap='sm'>
          <Link href={AUTH_ROUTES.LOGIN}>
            <Button
              size='sm'
              variant='outline'
              radius='md'
              fz={14}
              fw={500}
              rightSection={<LogIn size={18} />}
              className='hover:bg-primary! text-primary hover:text-white! transition-colors'
            >
              دخول
            </Button>
          </Link>
        </Group>
      </Flex>

      <HeaderDrawer opened={opened} toggle={toggle} />
    </AppShell.Header>
  );
}
