'use client';

import { Box, Center, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import { BLOG_TITLE, SUCCESS_STORIES_TITLE } from '@/content/landing';
import { TYPE_WRITTEN_CONTENT } from '@/types/landing/index.type';
import { IWrittenContentsResponse } from '@/types/landing/written-content/written-content.type';
import { getWrittenContents } from '@/actions/landing/written-content/getWrittenContents';
import WrittenContentList from './written-content-list';

interface IOurBlogOrStoriesProps {
  destination: TYPE_WRITTEN_CONTENT;
}

export default function OurWrittenContent({ destination }: IOurBlogOrStoriesProps) {
  const [activePage] = useQueryState('page', parseAsInteger.withDefault(1));
  const limit = 5;

  const {
    data: writtenContentData,
    isLoading,
    error,
  } = useQuery<IWrittenContentsResponse>({
    queryKey: ['WrittenContents', activePage],
    queryFn: () =>
      getWrittenContents({
        page: activePage,
        limit,
        type: destination,
      }),
  });

  const hasError = Boolean(error) || Boolean(writtenContentData?.error);

  const title = destination == TYPE_WRITTEN_CONTENT.BLOG ? BLOG_TITLE : SUCCESS_STORIES_TITLE;
  return (
    <Stack py={20} gap={10}>
      <Text px={{ base: 20, md: 30 }} fw={600} fz={25} w='100%' className='text-primary!'>
        {title}
      </Text>

      {hasError ? (
        <Paper p='md' mx={10} withBorder className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {writtenContentData?.error || error?.message || 'حدث خطأ أثناء جلب المحتوى'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <WrittenContentList
          destination={destination}
          data={writtenContentData?.writtenContents ?? []}
          totalPages={writtenContentData?.pagination?.totalPages ?? 1}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );
}
