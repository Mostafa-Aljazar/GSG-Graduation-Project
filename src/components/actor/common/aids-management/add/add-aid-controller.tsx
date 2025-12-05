'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack, Paper, Center, Text, ThemeIcon } from '@mantine/core';
import { MessageCircleWarning } from 'lucide-react';
import { useQueryStates, parseAsInteger, parseAsStringEnum } from 'nuqs';

import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { getAid } from '@/actions/actor/common/aids-management/getAid';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { useAidStore } from '@/stores/Aid.store';
import AddAidEditor from './add-aid-editor';
import { USER_TYPE } from '@/constants/user-types';

export default function AddAidController() {
  const { userId, userType } = useAlreadyUserStore();
  const aidStore = useAidStore();

  const [query] = useQueryStates({
    action: parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.ADD
    ),
    aidId: parseAsInteger.withDefault(0),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['aid', query.aidId],
    queryFn: () =>
      getAid({
        aidId: query.aidId,
        actorId: userId,
        role: userType as USER_TYPE.MANAGER | USER_TYPE.DELEGATE,
      }),
    enabled: query.aidId > 0 && query.action !== ACTION_ADD_EDIT_DISPLAY.ADD,
  });

  useEffect(() => {
    if (!data?.aid || isLoading || query.action === ACTION_ADD_EDIT_DISPLAY.ADD) return;

    const aid = data.aid;

    // Prepare categories to set
    const newCategories =
      aid.selectedCategories?.map((cat) => ({
        ...cat,
        isDefault: cat.isDefault ?? false,
      })) ?? [];

    // Only update store once
    aidStore.resetAidStore(); // clear all previous state

    aidStore.setFormValues({
      ...aid,
      selectedCategories: newCategories,
    });
    aidStore.setSelectedDisplacedIds(aid.selectedDisplacedIds ?? []);
    aidStore.setSelectedDelegatesPortions(aid.selectedDelegatesPortions ?? []);
    aidStore.setReceivedDisplaceds(aid.receivedDisplaceds ?? []);
    aidStore.setSecuritiesId(aid.securitiesId ?? []);
    aidStore.setIsCompleted(aid.isCompleted);
    aidStore.setAidStatus(aid.aidStatus);

    // Add categories
    newCategories.forEach((cat) => aidStore.addCategory(cat));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, query.action]);

  const hasError = isError || !!data?.error;

  return (
    <Stack w='100%' p={20} gap='xl'>
      {hasError ? (
        <Paper p='md' withBorder bg='red.0' className='text-center'>
          <Center mb='sm'>
            <ThemeIcon color='red' variant='light' size='lg'>
              <MessageCircleWarning />
            </ThemeIcon>
          </Center>
          <Text c='red' fw={600}>
            {data?.error || (error instanceof Error ? error.message : 'حدث خطأ أثناء جلب البيانات')}
          </Text>
        </Paper>
      ) : (
        <AddAidEditor
          isLoading={isLoading || (query.action === ACTION_ADD_EDIT_DISPLAY.ADD && query.aidId > 0)}
        />
      )}
    </Stack>
  );
}
