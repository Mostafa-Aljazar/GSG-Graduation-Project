'use client';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { Stack } from '@mantine/core';
import { Suspense, useEffect } from 'react';
import { parseAsStringEnum, useQueryStates } from 'nuqs';
import { COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { USER_TYPE } from '@/constants/user-types';
import ComplaintsHeaderTabs from './complaints-tabs';
import ComplaintsFeed from './complaints-feed';
import useAuth from '@/hooks/useAuth';
import { ComplaintsProvider } from '../context/complaints-context';

export default function ComplaintsView() {
  const { userId: userAlreadyId, userType: userAlreadyType } = useAlreadyUserStore();

  const { isDisplaced, isDelegate, isSecurityPerson } = useAuth();

  const [query, setQuery] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(
      Object.values(COMPLAINTS_TABS)
    ).withDefault(COMPLAINTS_TABS.SENT_COMPLAINTS),
  });

  useEffect(() => {
    if (userAlreadyType == USER_TYPE.DISPLACED) {
      setQuery({ 'complaints-tab': COMPLAINTS_TABS.SENT_COMPLAINTS });
    } else if (userAlreadyType == USER_TYPE.MANAGER) {
      setQuery({ 'complaints-tab': COMPLAINTS_TABS.RECEIVED_COMPLAINTS });
    } else {
      if (isDisplaced) {
        setQuery({ 'complaints-tab': COMPLAINTS_TABS.RECEIVED_COMPLAINTS });
      }
      if (isDelegate && userAlreadyType == USER_TYPE.SECURITY_PERSON) {
        setQuery({ 'complaints-tab': COMPLAINTS_TABS.RECEIVED_COMPLAINTS });
      }
      if (isSecurityPerson && userAlreadyType == USER_TYPE.DELEGATE) {
        setQuery({ 'complaints-tab': COMPLAINTS_TABS.SENT_COMPLAINTS });
      }
    }
  }, [userAlreadyId, userAlreadyType, isDisplaced, isDelegate, isSecurityPerson]);

  const hiddenTab =
    isDisplaced ||
    (isDelegate && userAlreadyType == USER_TYPE.SECURITY_PERSON) ||
    (isSecurityPerson && userAlreadyType == USER_TYPE.DELEGATE) ||
    userAlreadyType == USER_TYPE.DISPLACED ||
    userAlreadyType == USER_TYPE.MANAGER;

  return (
    <ComplaintsProvider>
      <Stack justify='center' align='center' pt={20} w='100%' px={10}>
        {!hiddenTab && (
          <Suspense fallback={<div>جارٍ التحميل...</div>}>
            <ComplaintsHeaderTabs />
          </Suspense>
        )}

        <Suspense fallback={<div>جارٍ التحميل...</div>}>
          <ComplaintsFeed />
        </Suspense>
      </Stack>
    </ComplaintsProvider>
  );
}
