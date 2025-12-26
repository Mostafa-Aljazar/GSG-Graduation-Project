import { getDisplacedProfile } from '@/actions/actor/displaceds/profile/getDisplacedProfile';
import { getDisplacedReceivedAids } from '@/actions/actor/displaceds/received-aids/getDisplacedReceivedAids';
import { IMG_FAVICON } from '@/assets/common';
import DisplacedReceivedAidHeaderTabs from '@/components/actor/displaceds/received-aids/displaced-received-aids-tabs';
import DisplacedReceivedAidsFeed from '@/components/actor/displaceds/received-aids/displaced-recived-aids-feed';
import { getDisplacedRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { DISPLACED_RECEIVED_AIDS_TABS } from '@/types/actor/common/index.type';
import { GET_DISPLACED_RECEIVED_AIDS_TABS } from '@/types/common/index.type';
import { Stack } from '@mantine/core';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

interface IDisplacedReceivedAidPageProps {
  params: Promise<{ displaced: string }>;
  searchParams: Promise<{ 'received-aids-tab'?: DISPLACED_RECEIVED_AIDS_TABS }>;
}

const FALLBACK = {
  TITLE: 'المساعدات للنازح | AL-AQSA Camp',
  DESCRIPTION: 'تفاصيل المساعدات المستلمة للنازحين على منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

export async function generateMetadata(
  { params, searchParams }: IDisplacedReceivedAidPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { displaced: displacedId } = await params;
  const { 'received-aids-tab': tabParam } = await searchParams;
  const tab = tabParam || DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const profileResponse = await getDisplacedProfile({ displacedId });
    const user = profileResponse?.status === 200 ? profileResponse.user : null;

    const aidsRes = await getDisplacedReceivedAids({
      displacedId,
      page: 1,
      limit: 1,
      tabType: tab,
    });
    const totalAids = aidsRes?.pagination?.totalItems || 0;

    if (user) {
      const title =
        `${GET_DISPLACED_RECEIVED_AIDS_TABS[tab]}: ${user.name} | AL-AQSA Camp` || FALLBACK.TITLE;
      const description =
        `عرض ${totalAids} ${GET_DISPLACED_RECEIVED_AIDS_TABS[tab]} لـ ${user.name} في مخيم الأقصى` ||
        FALLBACK.DESCRIPTION;
      const image = user.profileImage || FALLBACK.IMAGE;

      return {
        title,
        description,
        metadataBase: new URL(APP_URL),
        openGraph: {
          siteName: 'AL-AQSA Camp',
          title,
          description,
          type: 'website',
          url: APP_URL + getDisplacedRoutes({ displacedId }).RECEIVED_AIDS,
          images: [
            { url: IMG_FAVICON.src, width: 600, height: 600, alt: 'Displaced Received Aid' },
            ...previousImages,
          ],
          locale: 'ar',
        },
        twitter: {
          card: 'summary',
          title,
          description,
          images: [image],
        },
      };
    }
  } catch {
    // fallback below
  }

  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'website',
      url: APP_URL + getDisplacedRoutes({ displacedId }).RECEIVED_AIDS,
      images: [
        { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'AL-AQSA Camp' },
        ...previousImages,
      ],
      locale: 'ar',
    },
    twitter: {
      card: 'summary',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      images: [FALLBACK.IMAGE],
    },
  };
}

export default async function DisplacedReceivedAidPage({ params }: IDisplacedReceivedAidPageProps) {
  const { displaced } = await params;
  const displacedId = displaced;

  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'} px={10}>
      <DisplacedReceivedAidHeaderTabs />

      <Suspense fallback={<div>Loading...</div>}>
        <DisplacedReceivedAidsFeed displacedId={displacedId} />
      </Suspense>
    </Stack>
  );
}
