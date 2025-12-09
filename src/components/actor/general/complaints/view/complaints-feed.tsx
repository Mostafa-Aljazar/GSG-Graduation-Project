'use client';
import { Box, Center, Paper, Text, ThemeIcon } from '@mantine/core';
import { useComplaintsStore } from '../context/complaints-context';
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';
import { IComplaintsResponse } from '@/types/actor/general/complaints/complaints-response.type';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import ComplaintsFilters from './complaints-filters';
import { MessageCircleWarning } from 'lucide-react';
import ComplaintsList from './complaints-list';
import { getComplaints } from '@/actions/actor/general/complaints/getComplaints';
import useAuth from '@/hooks/useAuth';

// ManagerComplaints
export default function ComplaintsFeed() {
  const [query] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(
      Object.values(COMPLAINTS_TABS)
    ).withDefault(COMPLAINTS_TABS.SENT_COMPLAINTS),
    'complaints-page': parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(''),
  });

  const { userId: userAlreadyId, userType: userAlreadyType } = useAlreadyUserStore();
  const { user } = useAuth();
  const { localFilters, setComplaintsNum } = useComplaintsStore();

  const complaintType: COMPLAINTS_TABS =
    userAlreadyType == USER_TYPE.MANAGER
      ? COMPLAINTS_TABS.RECEIVED_COMPLAINTS
      : userAlreadyType == USER_TYPE.DISPLACED
      ? COMPLAINTS_TABS.SENT_COMPLAINTS
      : query['complaints-tab'];

  const limit = 7;

  const {
    data: complaintsData,
    isLoading,
    error,
  } = useQuery<IComplaintsResponse>({
    queryKey: ['common-complaints', query, localFilters, userAlreadyType, userAlreadyId, user],
    queryFn: () =>
      getComplaints({
        page: query['complaints-page'],
        limit: limit,
        status: localFilters.status || COMPLAINTS_STATUS.ALL,
        dateRange: localFilters.dateRange,
        search: query.search,
        complaintType: complaintType,
        userAlreadyId: userAlreadyId,
        userAlreadyType: userAlreadyType as USER_TYPE,
        userVisitId: user?.id as string,
        userVisitType: user?.role as USER_TYPE,
      }),
    enabled: !!userAlreadyId && !!userAlreadyType && !!user?.id && !!user?.role,
  });

  useEffect(() => {
    setComplaintsNum(complaintsData?.pagination?.totalItems || 0);
  }, [complaintsData]);

  if (!userAlreadyId) {
    return <Text c='red'>لا يمكن تحميل الشكاوى، لم يتم تحديد هوية المستخدم.</Text>;
  }

  const hasError = Boolean(error) || Boolean(complaintsData?.error);

  return (
    <Box dir='rtl' w='100%' p='sm'>
      <ComplaintsFilters />

      {hasError ? (
        <Paper p='md' withBorder mt='md' className='bg-red-100! rounded-md text-center'>
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
        <ComplaintsList
          complaints={complaintsData?.complaints || []}
          totalPages={complaintsData?.pagination.totalPages || 1}
          loading={isLoading}
        />
      )}
    </Box>
  );
}
