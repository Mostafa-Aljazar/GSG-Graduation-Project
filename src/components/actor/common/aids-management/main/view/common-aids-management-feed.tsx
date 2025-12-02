'use client';

import { useQuery } from '@tanstack/react-query';
import { Box, Center, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import CommonAidsManagementFilters from './common-aids-management-filters';
import { useAidsManagement } from '../context/aids-management-context';
import { IAidsResponse } from '@/types/actor/common/aids-management/aids-management.types';
import { getAids } from '@/actions/actor/common/aids-management/getAids';
import { USER_TYPE } from '@/constants/user-types';
import CommonAidsList from './card/common-aids-list';

export default function CommonAidsManagementFeed() {
  const { userId: actorId, userType: role } = useAlreadyUserStore();
  const { localFilters } = useAidsManagement();

  const [query] = useQueryStates({
    'aids-tab': parseAsStringEnum<TYPE_GROUP_AIDS>(Object.values(TYPE_GROUP_AIDS)).withDefault(
      TYPE_GROUP_AIDS.ONGOING_AIDS
    ),
    'aids-page': parseAsInteger.withDefault(1),
  });

  const limit = 10;

  const {
    data: AidsData,
    isLoading,
    error,
  } = useQuery<IAidsResponse>({
    queryKey: ['aids', query, localFilters],
    queryFn: () =>
      getAids({
        page: query['aids-page'],
        limit: limit,
        type: localFilters.type,
        dateRange: localFilters.dateRange,
        recipientsRange: localFilters.recipientsRange,
        aidStatus: query['aids-tab'],
        actorId,
        role: role as USER_TYPE.MANAGER | USER_TYPE.DELEGATE,
      }),
  });

  const hasError = Boolean(error) || Boolean(AidsData?.error);

  return (
    <Stack w={'100%'}>
      <CommonAidsManagementFilters />

      {hasError ? (
        <Paper p='md' withBorder mt='md' className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {AidsData?.error || error?.message || 'حدث خطأ أثناء جلب المساعدات'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <CommonAidsList
          aids={AidsData?.aids || []}
          totalPages={AidsData?.pagination.totalPages || 1}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );
}
