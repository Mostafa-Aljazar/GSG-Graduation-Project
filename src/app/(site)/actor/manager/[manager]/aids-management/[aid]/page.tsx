import { getAid } from '@/actions/actor/common/aids-management/getAid';
import { IMG_FAVICON } from '@/assets/common';
import AidView from '@/components/actor/common/aids-management/aid/aid-view';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { USER_TYPE } from '@/constants/user-types';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ manager: string; aid: string }>;
}

const FALLBACK = {
  TITLE: 'إدارة المساعدة | AL-AQSA Camp',
  DESCRIPTION: 'عرض تفاصيل المساعدة الخاصة بالمدير في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface Props {
  params: Promise<{ manager: string; aid: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId, aid: aidId } = await params;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getAid({
      aidId,
    });
    const aid = response?.aid;

    const title = aid ? `إدارة المساعدة: ${aid.aidName} | AL-AQSA Camp` : FALLBACK.TITLE;
    const description = aid
      ? `عرض تفاصيل المساعدة "${aid.aidName}" للمدير في منصة مخيم الأقصى.`
      : FALLBACK.DESCRIPTION;
    const image = FALLBACK.IMAGE;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + getManagerRoutes({ managerId, aidId }).AID,
        images: [
          { url: image, width: 600, height: 600, alt: aid?.aidName || 'Aid Details' },
          ...previousImages,
        ],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
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
        type: 'article',
        url: APP_URL + getManagerRoutes({ managerId, aidId }).AID,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Aid Details' },
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

export default async function AidPage({ params }: Props) {
  const { manager, aid } = await params;
  const managerId = manager;
  const aidId = aid;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AidView actorId={managerId} role={USER_TYPE.MANAGER} aidId={aidId} />
    </Suspense>
  );
}
