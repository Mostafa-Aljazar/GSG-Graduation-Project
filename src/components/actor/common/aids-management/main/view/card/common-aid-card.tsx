'use client';

import { cn } from '@/utils/cn';
import { Card, Center, Flex, Group, Stack, Text } from '@mantine/core';
import { Package, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { parseAsStringEnum, useQueryStates } from 'nuqs';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import { getAidsTypes, TYPE_AIDS, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';
import { getDelegateRoutes, getManagerRoutes } from '@/constants/routes';
import CommonAidAction from './common-aid-action';

interface ICommonAidCardProps {
  aid: TAid;
}

const getAidTypeIcon = (type: TYPE_AIDS) => {
  const IconComponent = getAidsTypes()[type].icon || Package;
  return <IconComponent size={20} className='text-white' />;
};

export default function CommonAidCard({ aid }: ICommonAidCardProps) {
  const [query] = useQueryStates({
    'aids-tab': parseAsStringEnum<TYPE_GROUP_AIDS>(Object.values(TYPE_GROUP_AIDS)).withDefault(
      TYPE_GROUP_AIDS.ONGOING_AIDS
    ),
  });

  const router = useRouter();
  const { user, isManager, isDelegate, isSecurityOfficer } = useAuth();
  const { userId: actorId, userType: role } = useAlreadyUserStore();
  const isOwner = actorId === user?.id;

  const handleClick = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    const clickedOnCard = path.some((el) => {
      const attr = (el as HTMLElement)?.getAttribute?.('data-click');
      const classes = (el as HTMLElement)?.classList?.toString() || '';
      return attr === 'aid-card' || classes.includes('aid-card');
    });

    if (!clickedOnCard) return;

    if (role === USER_TYPE.MANAGER && isManager) {
      router.push(`${getManagerRoutes({ managerId: actorId, aidId: aid.id }).AID}`);
    }

    if (
      role === USER_TYPE.DELEGATE &&
      (isManager || isSecurityOfficer || (isDelegate && isOwner))
    ) {
      router.push(`${getDelegateRoutes({ delegateId: actorId, aidId: aid.id }).AID}`);
    }
  };

  return (
    <Card
      data-click='aid-card'
      key={aid.id}
      p='xs'
      className={cn(
        'bg-red-50! shadow-md! border border-gray-200 rounded-lg hover:cursor-pointer',
        aid.isCompleted && 'bg-green-100!'
      )}
      onClick={handleClick}
    >
      <Group>
        <Center w={48} h={48} className='bg-primary/80 border border-gray-300 rounded-full'>
          {getAidTypeIcon(aid.aidType as TYPE_AIDS)}
        </Center>

        <Stack flex={1} gap={5}>
          <Group justify='space-between'>
            <Flex
              direction={{ base: 'column-reverse', sm: 'row' }}
              flex={1}
              justify='space-between'
              wrap='wrap-reverse'
              gap={0}
            >
              <Text fz='md' fw={600} className='text-primary!'>
                {aid.aidName || `مساعدة : ${aid.aidType}`}
              </Text>
              <Text fz={14} c='dimmed'>
                {new Date(aid.deliveryDate as Date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </Flex>

            {query['aids-tab'] !== TYPE_GROUP_AIDS.PREVIOUS_AIDS && (
              <CommonAidAction
                aidId={aid.id}
                aidDistributionMechanism={aid.distributionMechanism}
              />
            )}
          </Group>

          <Group gap={20}>
            <Group gap={5}>
              <UsersRound size={15} className='text-primary!' />
              <Text fz={14} className='text-dark!'>
                عدد المستفيدين : {` ${aid.selectedDisplacedIds.length}`}
              </Text>
            </Group>

            {query['aids-tab'] !== TYPE_GROUP_AIDS.COMING_AIDS && (
              <Group gap={5}>
                <UsersRound size={15} className='text-primary!' />
                <Text fz={14} className='text-dark!'>
                  عدد المستلمين : {` ${aid.receivedDisplaceds.length}`}
                </Text>
              </Group>
            )}
          </Group>

          {aid.additionalNotes && (
            <Text fz={14} c='dimmed'>
              {aid.additionalNotes}
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  );
}
