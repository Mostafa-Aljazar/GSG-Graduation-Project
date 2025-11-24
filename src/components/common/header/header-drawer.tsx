'use client';
import { Stack } from '@mantine/core';
import { Drawer } from '@mantine/core';
import Header_Links from '@/components/common/header/header-links';

interface IHeaderDrawerProps {
  opened: boolean;
  toggle: () => void;
}
export default function HeaderDrawer({ opened, toggle }: IHeaderDrawerProps) {
  return (
    <Drawer
      position='left'
      opened={opened}
      onClose={toggle}
      size={300}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      dir='rtl'
      hiddenFrom='lg'
    >
      <Stack h='100%' px='md'>
        <Header_Links />
      </Stack>
    </Drawer>
  );
}
