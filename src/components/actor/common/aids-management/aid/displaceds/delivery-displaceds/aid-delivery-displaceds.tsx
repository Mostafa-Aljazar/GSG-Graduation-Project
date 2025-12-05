'use client';

import { Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { Users } from 'lucide-react';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import AidDeliveryDisplacedsFilters from './aid-delivery-displaceds-filters';
import AidDisplacedsTable from './aid-displaceds-table';

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

interface IAidDeliveryDisplacedsProps {
  aidData: TAid;
}

export default function AidDeliveryDisplaceds({ aidData }: IAidDeliveryDisplacedsProps) {
  const [displacedNum, setDisplacedNum] = useState(aidData.selectedDisplacedIds.length);

  return (
    <Stack p={10} pos='relative' w='100%'>
      <AidHeader />

      <AidDeliveryDisplacedsFilters displacedNum={displacedNum} />

      <AidDisplacedsTable setDisplacedNum={setDisplacedNum} aidData={aidData} />
    </Stack>
  );
}
