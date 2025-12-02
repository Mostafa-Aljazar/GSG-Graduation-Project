'use client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { Package, SquarePlus } from 'lucide-react';
import { USER_TYPE } from '@/constants/user-types';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { getManagerRoutes } from '@/constants/routes';
import { Suspense } from 'react';
import CommonAidsManagementHeaderTabs from '../header/common-aids-management-header-tabs';
import CommonAidsManagementFeed from './common-aids-management-feed';
import { AidsManagementProvider } from '../context/aids-management-context';

function AidsManagementHeader() {
  const { userId: alreadyUserId, userType: alreadyUserType } = useAlreadyUserStore();
  const { user: userAuth } = useAuth();
  const visibleAdd = alreadyUserId === userAuth?.id && alreadyUserType == USER_TYPE.MANAGER;

  const route = useRouter();
  const handelAdd = () => {
    route.push(getManagerRoutes({ managerId: alreadyUserId }).ADD_AID);
  };

  return (
    <Group justify='space-between' align='center'>
      <Group gap={10}>
        <Package size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          المساعدات :
        </Text>
      </Group>
      {visibleAdd && (
        <Button
          size='sm'
          fz={16}
          fw={500}
          c='white'
          radius='lg'
          className='bg-primary!'
          rightSection={<SquarePlus size={16} />}
          onClick={handelAdd}
        >
          إضافة
        </Button>
      )}
    </Group>
  );
}

export default function CommonAidsManagementView() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <AidsManagementHeader />

      <Suspense fallback={<div>Loading...</div>}>
        <CommonAidsManagementHeaderTabs />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <AidsManagementProvider>
          <CommonAidsManagementFeed />
        </AidsManagementProvider>
      </Suspense>
    </Stack>
  );
}
