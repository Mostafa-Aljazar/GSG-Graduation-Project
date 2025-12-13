import { IMG_FAVICON } from '@/assets/common';
import AddWrittenContentForm from '@/components/actor/manager/written-content/add/written-form/add-written-content-form';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

const FALLBACK = {
  TITLE: 'إضافة إعلان أو مدونة أو قصة | AL-AQSA Camp',
  DESCRIPTION: 'إضافة محتوى جديد (إعلان، مدونة، قصة) للمنصة عبر المدير.',
  IMAGE: IMG_FAVICON.src,
};

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
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
      url: APP_URL + getManagerRoutes({ managerId: '' }).ADD_WRITTEN_CONTENT,
      images: [
        { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Add written content' },
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

export default function AddWrittenContentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddWrittenContentForm />
    </Suspense>
  );
}
