'use client';
import { Stack, Group, Text, Flex, Pagination } from '@mantine/core';
import { Package } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type';
import WrittenContentCard from './written-content-card';
import WrittenContentCardSkeleton from './written-content-card-skeleton';

interface IWrittenContentListProps {
  data: IWrittenContent[];
  totalPages: number;
  isLoading: boolean;
  managerId: string;
}

export default function WrittenContentList({
  data,
  totalPages,
  isLoading,
  managerId,
}: IWrittenContentListProps) {
  const [activePage, setActivePage] = useQueryState('written-page', parseAsInteger.withDefault(1));

  return (
    <Stack pos={'relative'} py={20}>
      {isLoading ? (
        <Stack gap='xs'>
          {Array.from({ length: 5 }).map((_, index) => (
            <WrittenContentCardSkeleton key={index} />
          ))}
        </Stack>
      ) : data.length === 0 ? (
        <Group gap={10} w={'100%'} justify='center' mt={30}>
          <Package size={25} className='text-primary!' />
          <Text fw={500} fz={24} ta='center' className='text-primary!'>
            لا توجد بيانات المحتوى لعرضها
          </Text>
        </Group>
      ) : (
        <Stack gap='xs'>
          {data.map((item) => (
            <WrittenContentCard key={item.id} writtenData={item} managerId={managerId} />
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
