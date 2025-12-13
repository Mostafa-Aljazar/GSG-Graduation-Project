import { getWrittenContent } from '@/actions/common/written-content/getWrittenContent';
import { IMG_FAVICON } from '@/assets/common';
import SingleWrittenContentView from '@/components/actor/manager/written-content/single-written-content/single-written-content-view';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

interface IProps {
  params: Promise<{ manager: string; id: string }>;
  searchParams: Promise<{ 'written-tab'?: TYPE_WRITTEN_CONTENT }>;
}

const FALLBACK = {
  TITLE: 'عرض المحتوى | AL-AQSA Camp',
  DESCRIPTION: 'عرض تفاصيل المحتوى النصي.',
  IMAGE: IMG_FAVICON.src,
};

export async function generateMetadata(
  { params, searchParams }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId, id: contentId } = await params;
  const { 'written-tab': tabParam } = await searchParams;
  const tab = tabParam || TYPE_WRITTEN_CONTENT.BLOG;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getWrittenContent({ id: contentId, type: tab });
    const content = response?.writtenContent;

    if (content) {
      const title = content.title || FALLBACK.TITLE;
      const description = content.brief || content.content?.slice(0, 160) || FALLBACK.DESCRIPTION;
      const images = (content?.imgs.length ? content.imgs : [FALLBACK.IMAGE]).map((img) => ({
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
          url:
            APP_URL +
            getManagerRoutes({
              managerId,
              writtenContent: { id: contentId, type: TYPE_WRITTEN_CONTENT.BLOG },
            }).WRITTEN_CONTENT,
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
    }
  } catch {}

  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'article',
      url:
        APP_URL +
        getManagerRoutes({
          managerId,
          writtenContent: { id: contentId, type: TYPE_WRITTEN_CONTENT.BLOG },
        }).WRITTEN_CONTENT,
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

export default async function ManagerSingleWrittenContentPage({ params }: IProps) {
  const { id } = await params;
  const contentId = id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SingleWrittenContentView writtenContentId={contentId} />
    </Suspense>
  );
}
