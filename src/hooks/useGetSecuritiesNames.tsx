'use client';

import { getSecurityNames } from '@/actions/actor/general/security-data/getSecurityNames';
import { ISecuritiesNamesResponse } from '@/types/actor/general/securities/securities-response.types';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  ids?: string[];
  mode: ACTION_ADD_EDIT_DISPLAY;
}

export default function useGetSecuritiesNames({ ids, mode }: IProps) {
  const isDisplayMode = mode === ACTION_ADD_EDIT_DISPLAY.DISPLAY;

  const queryKey =
    isDisplayMode && ids?.length ? ['securitiesNames', ...ids] : ['securitiesNames', 'all'];
  const { data, isLoading, error } = useQuery<ISecuritiesNamesResponse, Error>({
    queryKey,
    queryFn: () =>
      getSecurityNames({
        ids: isDisplayMode ? ids : undefined,
      }),
    enabled: Boolean(mode),
    retry: 1,
  });

  const hasError = Boolean(error) || Boolean(data?.error);

  return {
    securitiesData: data,
    isLoading,
    error,
    hasError,
  };
}
