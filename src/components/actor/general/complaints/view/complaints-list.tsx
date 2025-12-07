'use client';

import { Stack, Text, Flex, Pagination, Center } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { IComplaint } from '@/types/actor/general/complaints/complaints-response.type';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import ComplaintCard from '../complaint/complaint-card';
import ComplaintSkeleton from '../complaint/complaint-skeleton';

interface IComplaintsListProps {
  complaints: IComplaint[];
  totalPages: number;
  loading: boolean;
}

export default function ComplaintsList({ complaints, totalPages, loading }: IComplaintsListProps) {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    'complaints-page': parseAsInteger.withDefault(1),
  });

  return (
    <Stack pos={'relative'}>
      {loading ? (
        <Stack gap='xs'>
          {Array.from({ length: 8 }).map((_, index) => (
            <ComplaintSkeleton key={index} />
          ))}
        </Stack>
      ) : complaints.length === 0 ? (
        <Center mt={30} mih={200} className='bg-gray-50 p-6 border border-gray-200 rounded-md'>
          <Stack align='center' gap={6}>
            <MessageCircleWarning size={40} className='text-primary' />
            <Text fw={600} fz='lg' className='text-primary'>
              لا توجد شكاوي لعرضها
            </Text>
          </Stack>
        </Center>
      ) : (
        <Stack gap='xs'>
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Flex justify='center' mt='md'>
          <Pagination
            value={query['complaints-page']}
            onChange={(value: number) => setQuery({ 'complaints-page': value })}
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
