import { IMG_FAVICON } from '@/assets/common';
import WrittenContentView from '@/components/actor/manager/written-content/main/content/written-content-view';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

interface IWrittenContentPageProps {
  params: Promise<{ manager: string }>;
}

const FALLBACK = {
  TITLE: 'إدارة الإعلانات والمدونات والمقالات | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الإعلانات والمدونات والمقالات الخاصة بالمدير في منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

export async function generateMetadata(
  { params }: IWrittenContentPageProps,
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
      url: APP_URL + getManagerRoutes({ managerId }).ADD_WRITTEN_CONTENT,
      images: [
        { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Ads written content' },
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

export default async function WrittenContentPage({ params }: IWrittenContentPageProps) {
  const { manager } = await params;
  const managerId = manager;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WrittenContentView managerId={managerId} />
    </Suspense>
  );
}
