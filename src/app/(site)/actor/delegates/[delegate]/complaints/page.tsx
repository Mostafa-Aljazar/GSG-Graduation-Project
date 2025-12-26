import { getComplaints } from '@/actions/actor/general/complaints/getComplaints';
import { IMG_FAVICON } from '@/assets/common';
import ComplaintsView from '@/components/actor/general/complaints/view/complaints-view';
import { getDelegateRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { USER_RANK } from '@/constants/user-types';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'شكاوى المندوب | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالمندوبين في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface Props {
  params: Promise<{ delegate: string }>;
  searchParams: Promise<{ 'complaints-tab'?: COMPLAINTS_TABS }>;
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { delegate: delegateId } = await params;
  const { 'complaints-tab': tabParam } = await searchParams;
  const tab = tabParam || COMPLAINTS_TABS.SENT_COMPLAINTS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getComplaints({
      userAlreadyId: delegateId,
      userAlreadyType: USER_RANK.DELEGATE,
      complaintType: tab,
      page: 1,
      limit: 1,
      dateRange: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.totalItems || 0;

    const title = `شكاوى المندوب (${totalComplaints}) | AL-AQSA Camp` || FALLBACK.TITLE;
    const description =
      `عدد الشكاوى الخاصة بالمندوب: ${totalComplaints}. تصفح جميع الشكاوى في منصة مخيم الأقصى.` ||
      FALLBACK.DESCRIPTION;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + getDelegateRoutes({ delegateId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Delegate Complaints' },
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
        url: APP_URL + getDelegateRoutes({ delegateId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Delegate Complaints' },
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
