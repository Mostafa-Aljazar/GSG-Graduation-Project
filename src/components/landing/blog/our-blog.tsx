'use client';

import { Box, Center, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';

import { BLOG_TITLE } from '@/content/landing';
import { getArticles } from '@/actions/landing/blog/getArticles';
import { IArticlesResponse } from '@/types/landing/blog/blog.type';
import ArticleList from './articles-list';

export default function OurBlog() {
  const [activePage] = useQueryState('page', parseAsInteger.withDefault(1));
  const limit = 5;

  const { data, isLoading, error } = useQuery<IArticlesResponse>({
    queryKey: ['Articles', activePage],
    queryFn: () => getArticles({ page: activePage, limit }),
  });

  const hasError = Boolean(error) || Boolean(data?.error);

  return (
    <Stack py={20} gap={10}>
      <Text px={{ base: 20, md: 30 }} fw={600} fz={25} w='100%' className='text-primary!'>
        {BLOG_TITLE}
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
              {data?.error || error?.message || 'حدث خطأ أثناء جلب المحتوى'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <ArticleList
          articles={data?.articles ?? []}
          totalPages={data?.pagination?.totalPages ?? 1}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );
}
