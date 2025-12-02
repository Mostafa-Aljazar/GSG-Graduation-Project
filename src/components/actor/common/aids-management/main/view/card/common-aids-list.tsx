'use client';
import { Stack, Group, Text, Flex, Pagination } from '@mantine/core';
import { Package } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import CommonAidCardSkeleton from './common-aid-card-skeleton';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import CommonAidCard from './common-aid-card';

interface ICommonAidsListProps {
  aids: TAid[];
  totalPages: number;
  isLoading: boolean;
}

export default function CommonAidsList({ aids, totalPages, isLoading }: ICommonAidsListProps) {
  const [activePage, setActivePage] = useQueryState('aids-page', parseAsInteger.withDefault(1));

  return (
    <Stack pos={'relative'} py={20}>
      {isLoading ? (
        <Stack gap='xs'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CommonAidCardSkeleton key={index} />
          ))}
        </Stack>
      ) : aids.length === 0 ? (
        <Group gap={10} w={'100%'} justify='center' mt={30}>
          <Package size={25} className='text-primary!' />
          <Text fw={500} fz={24} ta='center' className='text-primary!'>
            لا توجد مساعدات لعرضها
          </Text>
        </Group>
      ) : (
        <Stack gap='xs'>
          {aids.map((aid) => (
            <CommonAidCard aid={aid} key={aid.id} />
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
