'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Center, Paper, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { IComplaintResponse } from '@/types/actor/general/complaints/complaints-response.type';
import { USER_TYPE, TUserRank, TUserType } from '@/constants/user-types';
import { TCommonComplaintFilterFormValues } from '@/validations/actor/general/complaints/commonComplaintsSchema';
import { getCommonComplaints } from '@/actions/actor/genral/complaints/getCommonComplaints';
import Common_Complaints_Filters from './common-complaints-filters';
import CommonComplaintsList from './common-complaints-list';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { MessageCircleWarning } from 'lucide-react';

interface ICommonComplaintsContentProps {
  actor_Id: number;
  rank: TUserType | TUserRank;
}

export default function CommonComplaintsContent({
  actor_Id,
  rank,
}: ICommonComplaintsContentProps) {
  const role = rank;

  const defaultTab =
    role == USER_TYPE.DISPLACED
      ? COMPLAINTS_TABS.SENT_COMPLAINTS
      : role == USER_TYPE.MANAGER
      ? COMPLAINTS_TABS.RECEIVED_COMPLAINTS
      : COMPLAINTS_TABS.SENT_COMPLAINTS;

  const [query, setQuery] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(
      Object.values(COMPLAINTS_TABS)
    ).withDefault(defaultTab),
    // ).withDefault(COMPLAINTS_TABS.SENT_COMPLAINTS),
    'complaints-page': parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(''),
  });

  const [localFilters, setLocalFilters] = useState<TCommonComplaintFilterFormValues>({
    status: null,
    date_range: [null, null],
  });

  const limit = 7;

  const {
    data: complaintsData,
    isLoading,
    error,
  } = useQuery<IComplaintResponse>({
    queryKey: ['common-complaints', query, localFilters, actor_Id],
    queryFn: () =>
      getCommonComplaints({
        page: query['complaints-page'],
        limit: limit,
        status: localFilters.status || COMPLAINTS_STATUS.ALL,
        date_range: localFilters.date_range,
        search: query.search,
        complaint_type: query['complaints-tab'],
        // role == USER_TYPE.DISPLACED
        //   ? COMPLAINTS_TABS.SENT_COMPLAINTS
        //   : role == USER_TYPE.MANAGER
        //   ? COMPLAINTS_TABS.RECEIVED_COMPLAINTS
        //   : query['complaints-tab'],
        role,
        actor_Id: actor_Id!,
      }),
    enabled: !!actor_Id,
  });

  if (!actor_Id) {
    return <Text c='red'>لا يمكن تحميل الشكاوى، لم يتم تحديد هوية المستخدم.</Text>;
  }
  const hasError = Boolean(error) || Boolean(complaintsData?.error);

  return (
    <Box dir='rtl' w='100%' p='sm'>
      <Common_Complaints_Filters
        setLocalFilters={setLocalFilters}
        complaintsNum={complaintsData?.pagination.total_items ?? 0}
        actor_Id={actor_Id}
        role={role}
      />

      {hasError ? (
        <Paper p='md' withBorder mt='md' className='!bg-red-100 rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {complaintsData?.error || error?.message || 'حدث خطأ أثناء جلب الشكاوى'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <CommonComplaintsList
          complaints={complaintsData?.complaints || []}
          total_pages={complaintsData?.pagination.total_pages || 1}
          loading={isLoading}
          actor_Id={actor_Id}
          role={role}
        />
      )}
    </Box>
  );
}
