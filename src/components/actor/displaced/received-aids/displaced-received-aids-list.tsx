'use client';

import { Stack, Text, Flex, Pagination, Center } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { IDisplacedReceivedAid } from '@/types/actor/displaced/received-aids/displacedReceivedAidsResponse.type';
import DisplacedReceivedAidSkeleton from './received-aid/displaced-received-aid-skeleton';
import DisplacedReceivedAidCard from './received-aid/displaced-received-aid-card';

interface IDisplacedReceivedAidsListProps {
  receivedAids: IDisplacedReceivedAid[];
  totalPages: number;
  loading: boolean;
}

export default function DisplacedReceivedAidsList({
  receivedAids,
  totalPages,
  loading,
}: IDisplacedReceivedAidsListProps) {
  const [query, setQuery] = useQueryStates({
    'received-aids-page': parseAsInteger.withDefault(1),
  });

  return (
    <Stack pos='relative' gap='sm'>
      {loading ? (
        <Stack gap='xs'>
          {Array.from({ length: 5 }).map((_, index) => (
            <DisplacedReceivedAidSkeleton key={index} />
          ))}
        </Stack>
      ) : receivedAids.length === 0 ? (
        <Center mt={30} mih={200} className='bg-gray-50 p-6 border border-gray-200 rounded-md'>
          <Stack align='center' gap={6}>
            <MessageCircleWarning size={40} className='text-primary' />
            <Text fw={600} fz='lg' className='text-primary'>
              لا توجد مساعدات لعرضها
            </Text>
          </Stack>
        </Center>
      ) : (
        <Stack gap='xs'>
          {receivedAids.map((receivedAid) => (
            <DisplacedReceivedAidCard key={receivedAid.id} receivedAid={receivedAid} />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Flex justify='center' mt='md'>
          <Pagination
            value={query['received-aids-page']}
            onChange={(value: number) => setQuery({ 'received-aids-page': value })}
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
