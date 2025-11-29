'use client';

import { Button, Group, Stack, Text } from '@mantine/core';
import { UserPlus, Users } from 'lucide-react';
import { Suspense } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { USER_RANK, USER_TYPE } from '@/constants/user-types';
import SecuritiesTable from './securities-table';

function SecuritiesListHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const showAddButton = user?.rank == USER_RANK.SECURITY_OFFICER || user?.role == USER_TYPE.MANAGER;
  return (
    <Group justify='space-between' align='center'>
      <Group gap={10}>
        <Users size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          بيانات أفراد الأمن :
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
          onClick={() => router.push(GENERAL_ACTOR_ROUTES.ADD_SECURITIES)}
        >
          إضافة أمن
        </Button>
      )}
    </Group>
  );
}

export default function SecuritiesList() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <SecuritiesListHeader />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <SecuritiesTable />
      </Suspense>
    </Stack>
  );
}
