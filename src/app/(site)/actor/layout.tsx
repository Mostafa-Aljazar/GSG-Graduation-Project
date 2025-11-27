import ActorNavbar from '@/components/actor/common/navbar/actor-navbar';
import { Group, Stack } from '@mantine/core';
import React from 'react';

export default function ActorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Group wrap='nowrap' gap={0} justify='start' align='start' pt={60}>
      <Stack w={250} visibleFrom='lg' justify='flex-start' align='center'>
        <ActorNavbar />
      </Stack>
      <Stack mih='100vh' w={'100%'} h={'100%'} justify='start'>
        {children}
      </Stack>
    </Group>
  );
}
