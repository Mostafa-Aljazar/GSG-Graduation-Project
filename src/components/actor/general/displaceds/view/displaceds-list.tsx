'use client';

import { Button, Group, Stack, Text } from '@mantine/core';
import { Database, UserPlus } from 'lucide-react';
import { Suspense } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { USER_TYPE } from '@/constants/user-types';
import { DisplacedsProvider } from '../context/displaceds-context';
import DisplacedsFilters from './displaceds-filters';
import DisplacedsTable from './displaceds-table';

function DisplacedsListHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const showAddButton = user?.role == USER_TYPE.DELEGATE || user?.role == USER_TYPE.MANAGER;

  return (
    <Group justify='space-between' align='center'>
      <Group gap={10}>
        <Database size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          بيانات النازحين :
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
          onClick={() => router.push(GENERAL_ACTOR_ROUTES.ADD_DISPLACEDS)}
        >
          إضافة نازح
        </Button>
      )}
    </Group>
  );
}

export default function DisplacedsList() {
  return (
    <DisplacedsProvider>
      <Stack p={10} pos='relative' w='100%'>
        <DisplacedsListHeader />

        <Suspense fallback={<div>جارٍ التحميل...</div>}>
          <DisplacedsFilters />
        </Suspense>

        <Suspense fallback={<div>جارٍ التحميل...</div>}>
          <DisplacedsTable />
        </Suspense>
      </Stack>
    </DisplacedsProvider>
  );
}
