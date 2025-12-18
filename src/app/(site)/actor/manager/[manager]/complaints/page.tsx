import { getComplaints } from '@/actions/actor/general/complaints/getComplaints';
import { IMG_FAVICON } from '@/assets/common';
import ComplaintsView from '@/components/actor/general/complaints/view/complaints-view';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { USER_RANK } from '@/constants/user-types';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'شكاوى المديرين | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالمديرين في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface IManagerComplaintsProps {
  params: Promise<{ manager: string }>;
}

export async function generateMetadata(
  { params }: IManagerComplaintsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId } = await params;
  const tab = COMPLAINTS_TABS.RECEIVED_COMPLAINTS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getComplaints({
      complaintType: tab,
      userAlreadyId: managerId,
      userAlreadyType: USER_RANK.MANAGER,
      page: 1,
      limit: 1,
      dateRange: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.totalItems || 0;

    const title =
      response.status == 200 ? `شكاوى المدير (${totalComplaints}) | AL-AQSA Camp` : FALLBACK.TITLE;
    const description =
      response.status == 200
        ? `عدد الشكاوى الخاصة بالمدير: ${totalComplaints}. تصفح جميع الشكاوى المرسلة والمستقبلة في منصة مخيم الأقصى.`
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
        url: APP_URL + getManagerRoutes({ managerId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Manager Complaints' },
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
        url: APP_URL + getManagerRoutes({ managerId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Manager Complaints' },
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
