import { IMG_FAVICON } from '@/assets/common';
import AddAidController from '@/components/actor/common/aids-management/add/add-aid-controller';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

const FALLBACK = {
  TITLE: 'إضافة مساعدة | AL-AQSA Camp',
  DESCRIPTION: 'إضافة مساعدة جديدة عبر المدير في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface IAddAidsManager {
  params: Promise<{ manager: string }>;
}

export async function generateMetadata(
  { params }: IAddAidsManager,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'website',
      url: APP_URL + getManagerRoutes({ managerId }).ADD_AID,
      images: [{ url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Add Aid' }, ...previousImages],
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

export default function ManagerAddAidPage() {
  return (
    <Suspense fallback={<div className='p-8 text-center'>جاري التحميل...</div>}>
      <AddAidController />
    </Suspense>
  );
}
