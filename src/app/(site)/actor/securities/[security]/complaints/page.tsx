import CommonComplaintsContent from '@/components/actor/general/complaints/common-complaints-content';
import CommonComplaintsHeaderTabs from '@/components/actor/general/complaints/common-complaints-tabs';
import { Stack } from '@mantine/core';
import type { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '@/constants/services';
import { getCommonComplaints } from '@/actions/actor/genral/complaints/getCommonComplaints';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { getSecurityRoutes } from '@/constants/routes';
import { USER_RANK } from '@/constants/user-types';

const FALLBACK = {
  TITLE: 'شكاوى الحراس | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى الخاصة بالحراس على منصة مخيم الأقصى.',
  IMAGE: 'https://example.com/favicon.png',
//   IMAGE: FAVICON.src,
};

interface Props {
  params: Promise<{ security: string }>;
  searchParams: Promise<{ 'complaints-tab'?: COMPLAINTS_TABS }>;
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { security } = await params;
  const securityId = Number(security);

  const { 'complaints-tab': tabParam } = await searchParams;
  const tab = tabParam || COMPLAINTS_TABS.SENT_COMPLAINTS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getCommonComplaints({
      actor_Id: securityId,
      role: USER_RANK.SECURITY_PERSON,
      complaint_type: tab,
      page: 1,
      limit: 1,
      status: COMPLAINTS_STATUS.ALL,
      date_range: [null, null],
      search: '',
    });

    const totalComplaints = response?.pagination?.total_items || 0;
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
        url: APP_URL + getSecurityRoutes({ securityId: securityId }).COMPLAINTS,
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
        url: APP_URL + getSecurityRoutes({ securityId: securityId }).COMPLAINTS,
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

export default async function SecurityComplaints({ params }: Props) {
  const { security } = await params;
  const securityId = Number(security);

  return (
    <Stack justify='center' align='center' pt={20} w='100%' px={10}>
      <CommonComplaintsHeaderTabs />
      <CommonComplaintsContent actor_Id={securityId} rank={USER_RANK.SECURITY_PERSON} />
    </Stack>
  );
}
