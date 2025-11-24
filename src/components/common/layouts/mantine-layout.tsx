'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { ReactNode } from 'react';
import HeaderComponent from '../header/header-component';
import FooterComponent from '../footer/footer-component';

export default function MantineLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pinned = useHeadroom({ fixedAt: 70 });
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
      flex={1}
      withBorder={false}
      className='flex-col! w-full! min-h-screen! flex!'
    >
      <HeaderComponent opened={opened} toggle={toggle} />

      <AppShell.Main
        flex={1}
        w={'100%'}
        h={'100%'}
        bg={'white'}
        className='flex-1! flex-col! w-full! h-full! flex!'
      >
        {children}
      </AppShell.Main>

      <FooterComponent />
    </AppShell>
  );
}
