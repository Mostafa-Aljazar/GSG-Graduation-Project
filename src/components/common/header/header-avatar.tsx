'use client';

import {
  Avatar,
  Popover,
  Button,
  Stack,
  Text,
  Divider,
  Group,
  UnstyledButton,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { logout } from '@/utils/auth/logout';
import { IMG_MAN } from '@/assets/actor';
import { User, LogOut } from 'lucide-react';
import { USER_TYPE } from '@/constants/user-types';
import {
  getDelegateRoutes,
  getDisplacedRoutes,
  getManagerRoutes,
  getSecurityRoutes,
} from '@/constants/routes';

export default function HeaderAvatar() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <UnstyledButton
        onClick={() => router.push('/login')}
        className='hover:scale-105 transition-transform'
      >
        <Avatar
          src={IMG_MAN.src}
          alt='Login'
          radius='xl'
          size={44}
          className='border-[0.5px]! border-gray-300! rounded-full! cursor-pointer'
        />
      </UnstyledButton>
    );
  }

  const goToProfile = () => {
    if (!user) return;

    let route: string | undefined;

    switch (user.role) {
      case USER_TYPE.DISPLACED:
        route = getDisplacedRoutes({ displacedId: user.id }).PROFILE;
        break;
      case USER_TYPE.DELEGATE:
        route = getDelegateRoutes({ delegateId: user.id }).PROFILE;
        break;
      case USER_TYPE.MANAGER:
        route = getManagerRoutes({ managerId: user.id }).PROFILE;
        break;
      case USER_TYPE.SECURITY_PERSON:
        route = getSecurityRoutes({ securityId: user.id }).PROFILE;
        break;
    }

    if (route) {
      router.push(route);
    }
  };

  return (
    <Popover position='bottom-end' withArrow shadow='md'>
      <Popover.Target>
        <Avatar
          src={user?.profileImage ?? IMG_MAN.src}
          alt={user?.name || 'User'}
          radius='xl'
          size={44}
          className='border-[0.5px]! border-gray-300! rounded-full! hover:scale-105 transition-transform cursor-pointer'
        />
      </Popover.Target>

      <Popover.Dropdown p='sm' className='min-w-[200px]'>
        <Group align='center' gap='sm' mb='xs'>
          <Avatar
            src={user?.profileImage ?? IMG_MAN.src}
            alt={user?.name ?? 'User'}
            radius='xl'
            size={42}
            className='border-[0.5px]! border-gray-300! rounded-full!'
          />
          <Stack gap={0}>
            <Text fw={600} size='sm'>
              {user?.name || 'User'}
            </Text>
            {user?.email && (
              <Text size='xs' c='dimmed'>
                {user.email}
              </Text>
            )}
          </Stack>
        </Group>

        <Divider mb='xs' />

        <Stack gap='xs'>
          <Button
            variant='light'
            size='xs'
            radius='md'
            leftSection={<User size={16} />}
            onClick={() => goToProfile()}
          >
            الملف الشخصي
          </Button>
          <Button
            variant='light'
            color='red'
            size='xs'
            radius='md'
            leftSection={<LogOut size={16} />}
            onClick={() => logout()} // <-- fix
          >
            تسجيل الخروج
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
