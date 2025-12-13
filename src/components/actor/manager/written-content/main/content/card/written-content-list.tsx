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
        <Stack gap='sm' w='100%' align='center' justify='center' mt={40}>
          <Flex
            align='center'
            justify='center'
            w={60}
            h={60}
            bg='gray.0'
            className='rounded-xl'
            mb='md'
          >
            <Package size={32} className='text-primary' />
          </Flex>

          <Text fw={600} fz={22} ta='center' c='gray.7'>
            لا توجد بيانات محتوى لعرضها
          </Text>

          <Text fw={400} fz={16} ta='center' c='gray.5' maw={300}>
            عند إضافة محتوى جديد سيتم عرضه هنا تلقائيًا.
          </Text>
        </Stack>
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
