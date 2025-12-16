'use client';

import { Group, Stack, Text } from '@mantine/core';
import { Users } from 'lucide-react';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import AidAddDisplacedsTable from './aid-add-displaceds-table';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';

function AidHeader() {
  return (
    <Group justify='right' align='center'>
      <Group gap={10}>
        <Users size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          كشف النازحين :
        </Text>
      </Group>
    </Group>
  );
}

interface IAidAddDisplacedsProps {
  aidData: TAid;
}

export default function AidAddDisplaceds({ aidData }: IAidAddDisplacedsProps) {
  const { userId } = useAlreadyUserStore();

  const delegatePortion =
    aidData.selectedDelegatesPortions?.find((item) => item.delegateId == userId)?.portion || 0;

  return (
    <Stack p={10} pos='relative' w='100%'>
      <Text>عليك اختيار {delegatePortion} عائلة فقط ...</Text>
      <AidHeader />

      <AidAddDisplacedsTable aidData={aidData} />
    </Stack>
  );
}
