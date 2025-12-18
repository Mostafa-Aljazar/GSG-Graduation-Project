import { getComplaints } from '@/actions/actor/general/complaints/getComplaints';
import { IMG_FAVICON } from '@/assets/common';
import ComplaintsView from '@/components/actor/general/complaints/view/complaints-view';
import { getSecurityRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'شكاوى الحراس | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى الخاصة بالحراس على منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface ISecurityComplaintsProp {
  params: Promise<{ security: string }>;
  searchParams: Promise<{ 'complaints-tab'?: COMPLAINTS_TABS }>;
}

export async function generateMetadata(
  { params, searchParams }: ISecurityComplaintsProp,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { security: securityId } = await params;

  const { 'complaints-tab': tabParam } = await searchParams;
  const tab = tabParam || COMPLAINTS_TABS.SENT_COMPLAINTS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getComplaints({
      userVisitId: securityId,
      userVisitType: 'SECURITY_PERSON',
      userAlreadyId: securityId,
      userAlreadyType: 'SECURITY_PERSON',
      complaintType: tab,
      page: 1,
      limit: 1,
      status: COMPLAINTS_STATUS.ALL,
      dateRange: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.totalItems || 0;
    const title = `شكاوى الحارس (${totalComplaints}) | AL-AQSA Camp` || FALLBACK.TITLE;
    const description =
      `عدد الشكاوى الخاصة بالحارس: ${totalComplaints}. تصفح جميع الشكاوى في منصة مخيم الأقصى.` ||
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
        url: APP_URL + getSecurityRoutes({ securityId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Security Complaints' },
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
        url: APP_URL + getSecurityRoutes({ securityId }).COMPLAINTS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Security Complaints' },
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
