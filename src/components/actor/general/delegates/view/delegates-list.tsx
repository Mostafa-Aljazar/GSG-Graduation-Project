'use client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { UserPlus, Users } from 'lucide-react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import useAuth from '@/hooks/useAuth';
import { USER_TYPE } from '@/constants/user-types';
import DelegatesTable from './delegates-table';

function DelegatesListHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const showAddButton = user?.role == USER_TYPE.MANAGER;
  return (
    <Group justify='space-between' align='center'>
      <Group gap={10}>
        <Users size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          بيانات المناديب :
        </Text>
      </Group>
      {showAddButton && (
        <Button
          size='sm'
          fz={16}
          fw={500}
          c='white'
          radius='lg'
          className='bg-primary!'
          rightSection={<UserPlus size={16} />}
          onClick={() => router.push(GENERAL_ACTOR_ROUTES.ADD_DELEGATES)}
        >
          إضافة مندوب
        </Button>
      )}
    </Group>
  );
}

export default function DelegatesList() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <DelegatesListHeader />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <DelegatesTable />
      </Suspense>
    </Stack>
  );
}
