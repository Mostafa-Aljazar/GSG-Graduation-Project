'use client';

import { getAid } from '@/actions/actor/common/aids-management/getAid';
import { USER_TYPE } from '@/constants/user-types';
import { IAidResponse, TAid } from '@/types/actor/common/aids-management/aids-management.types';
import { Box, Center, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { MessageCircleWarning } from 'lucide-react';
import AidContent from './aid-content';

export interface IAidViewProps {
  aidId: number;
  actorId: number;
  role: USER_TYPE.DELEGATE | USER_TYPE.MANAGER;
}

export default function AidView({ actorId, role, aidId }: IAidViewProps) {
  const {
    data: aidData,
    isLoading,
    error,
  } = useQuery<IAidResponse, Error>({
    queryKey: ['aid', aidId, actorId],
    queryFn: () => getAid({ aidId, actorId: actorId, role: role }),
  });

  const hasError = Boolean(error) || Boolean(aidData?.error);

  return (
    <Stack w={'100%'} p={20}>
      {hasError ? (
        <Paper p='md' withBorder m='md' className='bg-red-100! rounded-md text-center'>
          <Box>
            <Center mb='sm'>
              <ThemeIcon color='red' variant='light' size='lg'>
                <MessageCircleWarning />
              </ThemeIcon>
            </Center>
            <Text c='red' fw={600}>
              {aidData?.error || error?.message || 'حدث خطأ أثناء جلب بيانات المساعدة'}
            </Text>
          </Box>
        </Paper>
      ) : (
        <AidContent isLoading={isLoading} aidData={aidData?.aid as TAid} />
      )}
    </Stack>
  );
}
