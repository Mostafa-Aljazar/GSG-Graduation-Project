// src/utils/metadata/complaints-metadata-helper.ts

import type { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '@/constants/services';
import { getCommonComplaints } from '@/actions/actor/genral/complaints/getCommonComplaints';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
// import { FAVICON } from '@/assets/common';
import { USER_RANK } from '@/constants/user-types';
import { getManagerRoutes } from '@/constants/routes';


const FALLBACK = {
    TITLE: 'شكاوى عامة | AL-AQSA Camp',
    DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة في منصة مخيم الأقصى.',
    IMAGE: 'https://example.com/favicon.png',
    // IMAGE: FAVICON.src,
};

interface MetadataProps {
  actor_Id: number;
  role: USER_RANK;
  routeFunc: (args: { [key: string]: number }) => { COMPLAINTS: string };
  actorName: string;
}

export async function generateActorComplaintsMetadata(
  { actor_Id, role, routeFunc, actorName }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tab = COMPLAINTS_TABS.RECEIVED_COMPLAINTS;
  const previousImages = (await parent)?.openGraph?.images || [];
  

  try {
    const response = await getCommonComplaints({
      actor_Id,
      role,
      complaint_type: tab,
      page: 1,
      limit: 1,
      status: COMPLAINTS_STATUS.ALL,
      date_range: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.total_items || 0;

    const title =
      response.status == 200 ? `شكاوى ${actorName} (${totalComplaints}) | AL-AQSA Camp` : FALLBACK.TITLE;
    const description =
      response.status == 200
        ? `عدد الشكاوى الخاصة بـ ${actorName}: ${totalComplaints}. تصفح جميع الشكاوى المرسلة والمستقبلة في منصة مخيم الأقصى.`
        : FALLBACK.DESCRIPTION;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + routeFunc({ [`${actorName.toLowerCase()}_Id`]: actor_Id }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: `${actorName} Complaints` },
          ...previousImages,
        ],
        locale: 'ar',
      },
    };
  } catch (error) {
     console.error(error);
  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL || ''),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'website',
      url: APP_URL,
      images: previousImages,
      locale: 'ar',
    },
  };
  }
}