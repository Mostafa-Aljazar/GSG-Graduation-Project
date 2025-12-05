'use client';

import { Stack, Divider, LoadingOverlay, Group, Text, ThemeIcon, Badge } from '@mantine/core';

import { Package } from 'lucide-react';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import CommonAidView from './aid-info-view';
import { DISTRIBUTION_MECHANISM } from '@/types/actor/common/index.type';
import AidDelegatesListView from './delegates/aid-delegates-list';
import AidDeliveryDisplaceds from './displaceds/delivery-displaceds/aid-delivery-displaceds';

function AidHeader({ isCompleted = false }: { isCompleted: boolean; aidId: number }) {
  return (
    <Group gap={10} justify='space-between' w='100%'>
      <Group align='center' gap={5}>
        <ThemeIcon size={25} radius='xl' color='white'>
          <Package size={18} className='text-primary' />
        </ThemeIcon>
        <Text fz={{ base: 16, md: 18 }} fw={600} className='text-primary!'>
          تفاصيل المساعدة :
        </Text>
        <Badge
          color={isCompleted ? 'green' : 'yellow'}
          size='lg'
          variant='filled'
          className='w-fit'
        >
          الحالة : {isCompleted ? 'مكتمل' : 'قيد التنفيذ'}
        </Badge>
      </Group>
    </Group>
  );
}

interface IAidContentProps {
  isLoading: boolean;
  aidData: TAid;
}

export default function AidContent({ aidData, isLoading }: IAidContentProps) {
  return (
    <Stack pos={'relative'}>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 0.3 }}
      />

      <AidHeader isCompleted={aidData?.isCompleted} aidId={aidData?.id} />

      {aidData && <CommonAidView aidData={aidData} />}

      <Divider h={1} bg='#DFDEDC' w='100%' flex={1} />

      {aidData &&
        aidData?.distributionMechanism == DISTRIBUTION_MECHANISM.DELEGATES_LISTS &&
        aidData.selectedDelegatesPortions && (
          <AidDelegatesListView selectedDelegatesPortions={aidData.selectedDelegatesPortions} />
        )}

      <Divider h={1} bg='#DFDEDC' w='100%' flex={1} />

      {aidData && <AidDeliveryDisplaceds aidData={aidData} />}
    </Stack>
  );
}
