'use client';

import useAuth from '@/hooks/useAuth';
import { Stack } from '@mantine/core';
import { USER_TYPE } from '@/constants/user-types';
import WrittenContentHeaderTabs from '../header/written-content-header-tabs';
import WrittenContentHeader from '../header/written-content-header';
import WrittenContentFeed from './written-content-feed';

interface IWrittenContentViewProps {
  managerId: number;
}

export default function WrittenContentView({ managerId }: IWrittenContentViewProps) {
  const { user } = useAuth();
  const isOwner = user?.role == USER_TYPE.MANAGER && managerId == user?.id;

  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'} px={10}>
      <WrittenContentHeader visibleAdd={isOwner} managerId={managerId} />

      <WrittenContentHeaderTabs />

      <WrittenContentFeed managerId={managerId} />
    </Stack>
  );
}
