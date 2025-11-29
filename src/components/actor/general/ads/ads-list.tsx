'use client';

import { Flex, Group, Pagination, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type';
import AdCard from './ad/ad-card';
import AdSkeleton from './ad/ad-skeleton';

interface IAdsListProps {
  ads: IWrittenContent[];
  totalPages: number;
  loading: boolean;
}

export default function AdsList({ ads, totalPages, loading }: IAdsListProps) {
  const [query, setQuery] = useQueryStates({
    'ads-page': parseAsInteger.withDefault(1),
  });

  return (
    <Stack pos={'relative'}>
      {loading ? (
        <Stack gap='xs'>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
            {Array.from({ length: 8 }).map((_, index) => (
              <AdSkeleton key={index} />
            ))}
          </SimpleGrid>
        </Stack>
      ) : ads.length === 0 ? (
        <Paper p='xl' radius='md' withBorder>
          <Group gap={10} w={'100%'} justify='center' mt={30}>
            <MessageCircleWarning size={25} className='text-primary!' />
            <Text fw={500} fz={24} ta='center' className='text-primary!'>
              لا توجد إعلانات حالياً
            </Text>
          </Group>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
          {ads.map((ad, index) => (
            <AdCard key={index} ad={ad} />
          ))}
        </SimpleGrid>
      )}

      {!loading && totalPages > 1 && (
        <Flex justify='center' mt='xl'>
          <Pagination
            value={query['ads-page']}
            onChange={(value: number) => setQuery({ 'ads-page': value })}
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
