import { getAids } from '@/actions/actor/common/aids-management/getAids';
import { IMG_FAVICON } from '@/assets/common';
import CommonAidsManagementView from '@/components/actor/common/aids-management/main/view/common-aids-management-view';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { USER_TYPE } from '@/constants/user-types';
import { TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'إدارة مساعدات المدير | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع المساعدات التي يشرف عليها المدير في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface IAidsManager {
  params: Promise<{ manager: string }>;
  searchParams: Promise<{ 'aids-tab'?: TYPE_GROUP_AIDS }>;
}

export async function generateMetadata(
  { params, searchParams }: IAidsManager,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId } = await params;
  const { 'aids-tab': tabParam } = await searchParams;
  const tab = tabParam || TYPE_GROUP_AIDS.ONGOING_AIDS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const aidsResponse = await getAids({
      page: 1,
      limit: 1,
      dateRange: [null, null],
      recipientsRange: [null, null],
      type: null,
      actorId: managerId,
      role: USER_TYPE.MANAGER,
    });

    const totalAids = aidsResponse?.pagination?.totalItems || 0;
    const title = `مساعدات المدير (${totalAids}) | AL-AQSA Camp` || FALLBACK.TITLE;
    const description =
      `عدد المساعدات التي يشرف عليها المدير: ${totalAids}. تصفح جميع المساعدات في منصة مخيم الأقصى.` ||
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
        url: APP_URL + getManagerRoutes({ managerId }).AIDS_MANAGEMENT,
        images: [
          { url: IMG_FAVICON.src, width: 600, height: 600, alt: 'Displaced Received Aid' },
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
  } catch {}
  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'website',
      url: APP_URL + getManagerRoutes({ managerId }).AIDS_MANAGEMENT,
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

export default function ManagerAidsManagementPage() {
  return <CommonAidsManagementView />;
}
