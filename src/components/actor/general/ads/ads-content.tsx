'use client';

import { Text, Paper, ThemeIcon, Center, Box } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { getWrittenContents } from '@/actions/common/written-content/getWrittenContents';
import { IWrittenContentsResponse } from '@/types/common/written-content/written-content-response.type';
import AdsList from './ads-list';

export default function AdsContent() {
  const [query] = useQueryStates({
    'ads-page': parseAsInteger.withDefault(1),
  });

  const limit = 10;

  const {
    data: adsData,
    isLoading,
    error,
  } = useQuery<IWrittenContentsResponse>({
    queryKey: ['Ads', query],
    queryFn: () =>
      getWrittenContents({
        page: query['ads-page'],
        limit,
        type: TYPE_WRITTEN_CONTENT.ADS,
      }),
  });

  const hasError = Boolean(error) || Boolean(adsData?.error);

  return (
    <Box dir='rtl' w='100%' p='md'>
      {hasError ? (
        <Paper p='sm' withBorder className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {adsData?.error || error?.message || 'فشل في تحميل الإعلانات'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <AdsList
          ads={adsData?.writtenContents ?? []}
          totalPages={adsData?.pagination.totalPages ?? 1}
          loading={isLoading}
        />
      )}
    </Box>
  );
}
