import { USER_RANK } from '@/constants/user-types';
import type { Metadata, ResolvingMetadata } from 'next';
import { generateActorComplaintsMetadata } from '@/utils/metadata/actor-complaints-wrapper';
import ActorComplaintsWrapper from '@/components/complaints-view/ActorComplaintsWrapper';
import { getDelegateRoutes } from '@/constants/routes';
import { Suspense } from 'react';
import { Stack } from '@mantine/core';
import CommonComplaintsHeaderTabs from '@/components/actor/general/complaints/common-complaints-tabs';

interface IProps {
  params: Promise<{ delegate: string }>;
  searchParams: Promise<{ 'complaints-tab'?: string }>;
}

const FALLBACK = {
  TITLE: 'شكاوى المندوب | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالمندوبين في منصة مخيم الأقصى.',
  IMAGE: 'https://example.com/favicon.png',
    // IMAGE: FAVICON.src,
};


export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { delegate } = await params;
  const delegateId = Number(delegate);

  return generateActorComplaintsMetadata(
    {
      actor_Id: delegateId,
      role: USER_RANK.DELEGATE,
      routeFunc: getDelegateRoutes,
      actorName: 'المندوب',
      FALLBACK
    },
    parent
  );
}

export default async function Page({ params }: IProps) {
  const { delegate } = await params;
  const delegateId = Number(delegate);

  return (
    <Stack justify="center" align="center" pt={20} w="100%" px={10}>
      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <CommonComplaintsHeaderTabs />
      </Suspense>

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <ActorComplaintsWrapper actor_Id={delegateId} rank={USER_RANK.DELEGATE} />
      </Suspense>
    </Stack>
  );
}
