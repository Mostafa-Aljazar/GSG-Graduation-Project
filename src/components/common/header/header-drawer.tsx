'use client';
import { Stack } from '@mantine/core';
import { Drawer } from '@mantine/core';
import Header_Links from '@/components/common/header/header-links';
import { usePathname } from 'next/navigation';
import ActorNavbar from '@/components/actor/common/navbar/actor-navbar';

interface IHeaderDrawerProps {
  opened: boolean;
  toggle: () => void;
}
export default function HeaderDrawer({ opened, toggle }: IHeaderDrawerProps) {
  const pathname = usePathname();
  const isActor = pathname.includes('actor');

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
      {isActor ? (
        <Stack w={'100%'} justify='flex-start' align='center'>
          <ActorNavbar />
        </Stack>
      ) : (
        <Stack h='100%' px='md'>
          <Header_Links />
        </Stack>
      )}
    </Drawer>
  );
}
