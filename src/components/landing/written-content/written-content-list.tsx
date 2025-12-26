'use client';
import { Stack, Text, Flex, Pagination, Paper, ThemeIcon } from '@mantine/core';
import { FileSearch } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type';
import WrittenContentCard from './written-content-card';
import WrittenContentCardSkeleton from './written-content-card-skeleton';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';

interface IBlogOrStoriesListProps {
  data: IWrittenContent[];
  totalPages: number;
  isLoading: boolean;
  destination: TYPE_WRITTEN_CONTENT;
}

export default function WrittenContentList({
  data,
  totalPages,
  isLoading,
  destination,
}: IBlogOrStoriesListProps) {
  const [activePage, setActivePage] = useQueryState('page', parseAsInteger.withDefault(1));

  const LoadingSection = isLoading && (
    <Stack gap='xs' align='center' w={'100%'} px={{ base: 20, md: 30, lg: 130 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <WrittenContentCardSkeleton key={index} />
      ))}
    </Stack>
  );

  const EmptySection = data.length === 0 && (
    <Paper
      w={{ base: '95%', sm: '80%', md: '60%' }}
      p={{ base: 'xl', md: '2xl' }}
      radius='xl'
      shadow='lg'
      withBorder
      className='bg-[--color-second-light] mx-auto border-[--color-second]/20 text-center'
    >
      <Stack align='center' gap='lg'>
        <ThemeIcon
          size={60}
          radius='xl'
          variant='light'
          className='bg-second-light border-4 border-second/30 border-dashed'
        >
          <FileSearch size={30} className='text-primary' strokeWidth={1.8} />
        </ThemeIcon>

        <Text fz={{ base: 16, md: 20 }} fw={500} className='text-primary!'>
          {destination === TYPE_WRITTEN_CONTENT.BLOG
            ? 'لا توجد مقالات حاليًا'
            : 'لا توجد قصص نجاح حاليًا'}
        </Text>

        <Text fz={{ base: 14, md: 16 }} c='gray.7' maw={500} className='leading-relaxed'>
          {destination === TYPE_WRITTEN_CONTENT.BLOG
            ? 'سنقوم قريبًا بنشر مقالات جديدة ومفيدة حول أنشطتنا الإغاثية والمشاريع الميدانية.'
            : 'قريبًا سنشارك معكم قصص نجاح ملهمة لعائلات استفادت من دعمكم وجهودنا.'}
        </Text>

        <Text fz='sm' c='gray.6' className='font-medium'>
          تابعونا ليصلكم كل جديد
        </Text>
      </Stack>
    </Paper>
  );

  const CardListSection = (
    <Stack gap='xs' align='center' w={'100%'} px={{ base: 20, md: 30, lg: 130 }}>
      {data.map((item, index) => (
        <WrittenContentCard
          key={index}
          id={item.id}
          createdAt={item.createdAt}
          title={item.title}
          content={item.content}
          imgs={item.imgs}
          brief={item.brief}
          type={destination}
        />
      ))}
    </Stack>
  );

  return (
    <Stack w={'100%'} pos={'relative'} align='center' justify='center'>
      {isLoading ? LoadingSection : data.length === 0 ? EmptySection : CardListSection}

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
