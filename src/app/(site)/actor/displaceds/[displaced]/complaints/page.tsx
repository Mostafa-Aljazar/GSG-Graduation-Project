import CommonComplaintsContent from '@/components/actor/general/complaints/common-complaints-content';
import { USER_RANK } from '@/constants/user-types';
import { Stack } from '@mantine/core';
import { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '@/constants/services';
import { getDisplacedRoutes } from '@/constants/routes';
import { getCommonComplaints } from '@/actions/actor/genral/complaints/getCommonComplaints';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';

const FALLBACK = {
  TITLE: 'شكاوى النازحين | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالنازحين في منصة مخيم الأقصى.',
  IMAGE: 'https://example.com/favicon.png',
//   IMAGE: FAVICON.src,
};

interface Props {
  params: Promise<{ displaced: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { displaced } = await params;
  const displacedId = Number(displaced);
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getCommonComplaints({
      actor_Id: displacedId,
      role: USER_RANK.DISPLACED,
      complaint_type: COMPLAINTS_TABS.SENT_COMPLAINTS,
      page: 1,
      limit: 1,
      status: COMPLAINTS_STATUS.ALL,
      date_range: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.total_items || 0;

    const title = `شكاوى النازح (${totalComplaints}) | AL-AQSA Camp`;
    const description = `عدد الشكاوى الخاصة بالنازح: ${totalComplaints}. تصفح جميع الشكاوى المرسلة والمستقبلة في منصة مخيم الأقصى.`;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + getDisplacedRoutes({ displacedId: displacedId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Displaced Complaints' },
          ...previousImages,
        ],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [FALLBACK.IMAGE],
      },
    };
  } catch {
    return {
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        type: 'website',
        url: APP_URL + getDisplacedRoutes({ displacedId: displacedId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Displaced Complaints' },
          ...previousImages,
        ],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        images: [FALLBACK.IMAGE],
      },
    };
  }
}

export default async function DisplacedComplaints({ params }: Props) {
  const { displaced } = await params;
  const displacedId = Number(displaced);

  return (
    <Stack justify='center' align='center' pt={20} w='100%' px={10}>
      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <CommonComplaintsContent actor_Id={displacedId} rank={USER_RANK.DISPLACED} />
      </Suspense>
    </Stack>
  );
}
