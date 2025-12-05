import { ISelectedDelegatePortion } from '@/types/actor/common/aids-management/aids-management.types';
import { Group, Stack, Text } from '@mantine/core';
import { Database } from 'lucide-react';
import React, { Suspense } from 'react';
import AidDelegatesTableView from './aid-delegates-table-view';

interface IAidDelegatesListProps {
  selectedDelegatesPortions: ISelectedDelegatePortion[];
}

function AidDelegatesListHeader() {
  const title = '  : بيانات المناديب';

  return (
    <Group justify='right' align='center'>
      <Group gap={10}>
        <Database size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          {title} :
        </Text>
      </Group>
    </Group>
  );
}

export default function AidDelegatesListView({
  selectedDelegatesPortions,
}: IAidDelegatesListProps) {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <AidDelegatesListHeader />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <AidDelegatesTableView selectedDelegatesPortions={selectedDelegatesPortions} />
      </Suspense>
    </Stack>
  );
}
