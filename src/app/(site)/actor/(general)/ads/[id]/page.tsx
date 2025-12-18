import { Suspense } from 'react';
import SingleWrittenContentView from '@/components/actor/manager/written-content/single-written-content/single-written-content-view';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IMG_FAVICON } from '@/assets/common';
import { Metadata, ResolvingMetadata } from 'next';
import { APP_URL } from '@/constants/services';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { getWrittenContent } from '@/actions/common/written-content/getWrittenContent';

interface IAdPageProps {
  params: Promise<{ id: string }>;
}


const FALLBACK = {
  TITLE: 'إعلان | AL-AQSA Camp',
  DESCRIPTION: 'شاهد أحدث الإعلانات والمحتوى على منصة مخيم الأقصى للنازحين',
  IMAGE: IMG_FAVICON.src,
};

export async function generateMetadata(
  { params }: IAdPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const { writtenContent: ad } = await getWrittenContent({
      id,
      type: TYPE_WRITTEN_CONTENT.ADS,
    });

    const title = ad?.title ?? FALLBACK.TITLE;
    const description = ad?.brief?.slice(0, 160) ?? FALLBACK.DESCRIPTION;

    const images = (ad?.imgs?.length ? ad.imgs : [FALLBACK.IMAGE]).map((img) => ({
      url: typeof img === 'string' ? img : FALLBACK.IMAGE,
      width: 1280,
      height: 720,
      alt: title,
    }));

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'article',
        url: `${APP_URL + GENERAL_ACTOR_ROUTES.ADS}/${id}`,
        images: [...images, ...previousImages],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      },
    };
  } catch (error) {
    return {
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        type: 'article',
        url: `${APP_URL + GENERAL_ACTOR_ROUTES.ADS}/${id}`,
        images: [
          {
            url: FALLBACK.IMAGE,
            width: 1280,
            height: 720,
            alt: FALLBACK.TITLE,
          },
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

export default async function AdPage({ params }: IAdPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SingleWrittenContentView writtenContentId={id} destination={TYPE_WRITTEN_CONTENT.ADS} />
    </Suspense>
  );
}
