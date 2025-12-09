'use client';

import { getDelegatesNames } from '@/actions/actor/general/delegates/getDelegatesNames';
import { IDelegatesNamesResponse } from '@/types/actor/general/delegates/delegates-response.type';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  ids?: string[];
  mode: ACTION_ADD_EDIT_DISPLAY;
}

export default function useGetDelegatesNames({ ids, mode }: IProps) {
  const isDisplayMode = mode === ACTION_ADD_EDIT_DISPLAY.DISPLAY;

  const queryKey =
    isDisplayMode && ids?.length ? ['delegatesNames', ...ids] : ['delegatesNames', 'all'];

  const { data, isLoading, error } = useQuery<IDelegatesNamesResponse, Error>({
    queryKey,
    queryFn: () =>
      getDelegatesNames({
        ids: isDisplayMode ? ids : undefined,
      }),
    enabled: Boolean(mode),
    retry: 1,
  });

  const hasError = Boolean(error) || Boolean(data?.error);

  return {
    delegatesData: data,
    isLoading,
    error,
    hasError,
  };
}
