import { getComplaints } from '@/actions/actor/general/complaints/getComplaints';
import { IMG_FAVICON } from '@/assets/common';
import ComplaintsView from '@/components/actor/general/complaints/view/complaints-view';
import { getDisplacedRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { USER_RANK } from '@/constants/user-types';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'شكاوى النازحين | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالنازحين في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface Props {
  params: Promise<{ displaced: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { displaced: displacedId } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getComplaints({
      userAlreadyId: displacedId,
      userAlreadyType: USER_RANK.DISPLACED,
      userVisitId: displacedId,
      userVisitType: USER_RANK.DISPLACED,
      complaintType: COMPLAINTS_TABS.SENT_COMPLAINTS,
      page: 1,
      limit: 1,
      status: COMPLAINTS_STATUS.ALL,
      dateRange: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.totalItems || 0;

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
        url: APP_URL + getDisplacedRoutes({ displacedId }).COMPLAINTS,
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
        url: APP_URL + getDisplacedRoutes({ displacedId }).COMPLAINTS,
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

export default async function ComplaintsPage() {
  return <ComplaintsView />;
}
