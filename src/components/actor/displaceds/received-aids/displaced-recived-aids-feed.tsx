'use client';

import { useQuery } from '@tanstack/react-query';
import { Box, Text, Center, ThemeIcon, Paper } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import { DISPLACED_RECEIVED_AIDS_TABS } from '@/types/actor/common/index.type';
import DisplacedReceivedAidsList from './displaced-received-aids-list';
import { IDisplacedReceivedAidsResponse } from '@/types/actor/displaceds/received-aids/displaced-received-aids-response.type';
import { getDisplacedReceivedAids } from '@/actions/actor/displaceds/received-aids/getDisplacedReceivedAids';

interface DelegateComplaintsContentProps {
  displacedId: string;
}

export default function DisplacedReceivedAidsFeed({ displacedId }: DelegateComplaintsContentProps) {
  const [query] = useQueryStates({
    'received-aids-tab': parseAsStringEnum<DISPLACED_RECEIVED_AIDS_TABS>(
      Object.values(DISPLACED_RECEIVED_AIDS_TABS)
    ).withDefault(DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS),
    'received-aids-page': parseAsInteger.withDefault(1),
  });

  const limit = 7;

  const {
    data: displacedReceivedAids,
    isLoading,
    error,
  } = useQuery<IDisplacedReceivedAidsResponse>({
    queryKey: ['receivedAids', query],
    queryFn: () =>
      getDisplacedReceivedAids({
        page: query['received-aids-page'],
        limit: limit,
        tabType: query['received-aids-tab'],
        displacedId,
      }),
    enabled: !!displacedId,
  });

  const hasError = Boolean(error) || Boolean(displacedReceivedAids?.error);

  return (
    <Box dir='rtl' w='100%'>
      {hasError ? (
        <Paper p='md' withBorder className='bg-red-100! rounded-md text-center'>
          <Center mb='sm'>
            <ThemeIcon color='red' variant='light' size='lg'>
              <MessageCircleWarning />
            </ThemeIcon>
          </Center>
          <Text c='red' fw={600}>
            {displacedReceivedAids?.error || error?.message || 'حدث خطأ أثناء جلب المساعدات'}
          </Text>
        </Paper>
      ) : (
        <DisplacedReceivedAidsList
          receivedAids={displacedReceivedAids?.receivedAids || []}
          totalPages={displacedReceivedAids?.pagination.totalPages || 1}
          loading={isLoading}
        />
      )}
    </Box>
  );
}
