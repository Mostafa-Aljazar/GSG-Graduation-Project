'use client';
import { Stack, Text, Flex, Pagination, Paper, Box, Center, ThemeIcon } from '@mantine/core';
import { Package } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { IArticle } from '@/types/landing/blog/blog.type';
import ArticleCardSkeleton from './article-card-skeleton';
import ArticleCard from './article-card';

interface Props {
  articles: IArticle[];
  totalPages: number;
  isLoading: boolean;
}

export default function ArticleList({ articles, totalPages, isLoading }: Props) {
  const [activePage, setActivePage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <Stack w={'100%'} pos={'relative'} align='center' justify='center'>
      {isLoading ? (
        <Stack gap='xs' align='center' w={'100%'} px={{ base: 20, md: 30, lg: 130 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </Stack>
      ) : articles.length === 0 ? (
        <Paper w={'95%'} p='md' withBorder className='bg-second-light! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='primary' variant='light' size='lg'>
                <Package size={25} className='text-primary!' />
              </ThemeIcon>
            </Center>
            <Text fw={600} fz={16} ta='center' className='text-primary!'>
              بيانات المحتوى لا توجد لعرضها
            </Text>
          </Box>
        </Paper>
      ) : (
        <Stack gap='xs' align='center' w={'100%'} px={{ base: 20, md: 30, lg: 130 }}>
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              id={article.id}
              createdAt={article.createdAt}
              title={article.title}
              content={article.content}
              imgs={article.imgs}
              brief={article.brief}
            />
          ))}
        </Stack>
      )}

      {!isLoading && totalPages > 1 && (
        <Flex justify='center' mt='xl'>
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            size='sm'
            radius='xl'
            withControls={false}
            mx='auto'
            classNames={{
              dots: '!rounded-full !text-gray-300 border-1',
              control: '!rounded-full',
            }}
          />
        </Flex>
      )}
    </Stack>
  );
}
