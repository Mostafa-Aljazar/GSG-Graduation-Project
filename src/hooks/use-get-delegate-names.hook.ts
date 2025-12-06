'use client';

import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/actors-information.type';
import { useQuery } from '@tanstack/react-query';
import { getDelegatesNames } from '@/actions/actors/delegates/name/get-delegate-name';
import { DelegatesNamesResponse } from '@/types/delegate/general/delegate-response.type';

interface Props {
  ids?: number[]; // Specific delegate IDs for DISPLAY mode
  mode: ACTION_ADD_EDIT_DISPLAY; // Mode to determine fetch behavior
}

export default function useGetDelegatesNames({ ids, mode }: Props) {
  const isDisplayMode = mode === ACTION_ADD_EDIT_DISPLAY.DISPLAY;
  const queryKey = isDisplayMode && ids ? ['delegatesNames', ids] : ['delegatesNames', 'all'];

  const {
    data: delegatedData,
    isLoading: isLoadingDelegated,
    error: queryDelegateError,
  } = useQuery<DelegatesNamesResponse, Error>({
    queryKey,
    queryFn: () => getDelegatesNames({ ids: isDisplayMode ? ids : undefined }),
    retry: 1,
    enabled: !!mode, // Ensure query runs only when mode is defined
  });

  const isLoading = isLoadingDelegated;
  const hasError = Boolean(queryDelegateError) || Boolean(delegatedData?.error);

  return {
    isLoading,
    error: queryDelegateError,
    hasError,
    delegatedData,
  };
}
