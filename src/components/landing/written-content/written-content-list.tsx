'use client';
import { Stack, Text, Flex, Pagination, Paper, Box, Center, ThemeIcon } from '@mantine/core';
import { Package } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { TYPE_WRITTEN_CONTENT } from '@/types/landing/index.type';
import { IWrittenContent } from '@/types/landing/written-content/written-content.type';
import WrittenContentCard from './written-content-card';
import WrittenContentCardSkeleton from './written-content-card-skeleton';

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

  return (
    <Stack w={'100%'} pos={'relative'} align='center' justify='center'>
      {isLoading ? (
        <Stack gap='xs' align='center' w={'100%'} px={{ base: 20, md: 30, lg: 130 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <WrittenContentCardSkeleton key={index} />
          ))}
        </Stack>
      ) : data.length === 0 ? (
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
