'use client';

import { Box, Center, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { getWrittenContents } from '@/actions/common/written-content/getWrittenContents';
import { IWrittenContentsResponse } from '@/types/common/written-content/written-content-response.type';
import WrittenContentList from './card/written-content-list';

interface IWrittenContentFeedProps {
  managerId: number;
}
export default function WrittenContentFeed({ managerId }: IWrittenContentFeedProps) {
  const [query] = useQueryStates({
    'written-tab': parseAsStringEnum<TYPE_WRITTEN_CONTENT>(
      Object.values(TYPE_WRITTEN_CONTENT)
    ).withDefault(TYPE_WRITTEN_CONTENT.BLOG),
    'written-page': parseAsInteger.withDefault(1),
  });

  const limit = 10;

  const {
    data: writtenContentsData,
    isLoading,
    error,
  } = useQuery<IWrittenContentsResponse>({
    queryKey: ['WrittenContents', query],
    queryFn: () =>
      getWrittenContents({
        page: query['written-page'],
        limit,
        type: query['written-tab'],
      }),
  });
  const hasError = Boolean(error) || Boolean(writtenContentsData?.error);

  return (
    <Stack w={'100%'}>
      {hasError ? (
        <Paper p='md' withBorder mt='md' className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {writtenContentsData?.error || error?.message || 'حدث خطأ أثناء جلب المحتوى'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <WrittenContentList
          data={writtenContentsData?.writtenContents || []}
          totalPages={writtenContentsData?.pagination.totalPages || 1}
          isLoading={isLoading}
          managerId={managerId}
        />
      )}
    </Stack>
  );
}
