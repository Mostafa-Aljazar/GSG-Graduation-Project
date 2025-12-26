import { getWrittenContent } from '@/actions/common/written-content/getWrittenContent';
import { IMG_BLOG_CHILD } from '@/assets/landing/blog';
import SingleWrittenContentComponent from '@/components/landing/written-content/single-written-content/single-written-content-component';
import { LANDING_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Stack } from '@mantine/core';
import { Metadata, ResolvingMetadata } from 'next';

interface IArticlePageProps {
  params: Promise<{ id: string; contentType: TYPE_WRITTEN_CONTENT }>;
}

const FALLBACK = {
  TITLE: 'مقال | AL-AQSA Camp',
  DESCRIPTION: 'اقرأ مقالات منصة مخيم الأقصى حول المواضيع المختلفة.',
  IMAGE: IMG_BLOG_CHILD.src,
};

export async function generateMetadata(
  { params }: IArticlePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const { writtenContent: article } = await getWrittenContent({
      id: id,
      type: TYPE_WRITTEN_CONTENT.BLOG,
    });

    const title = article?.title ?? FALLBACK.TITLE;
    const description = article?.brief?.substring(0, 160) ?? FALLBACK.DESCRIPTION;

    const images = (article?.imgs.length ? article.imgs : [FALLBACK.IMAGE]).map((img) => ({
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
        url: `${APP_URL + LANDING_ROUTES.BLOG}/${id}`,
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
        url: `${APP_URL + LANDING_ROUTES.BLOG}/${id}`,
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

export default async function SingleWrittenContentPage({ params }: IArticlePageProps) {
  const { id, contentType } = await params;

  return (
    <Stack pt={60} className='w-full' mih='100vh'>
      <SingleWrittenContentComponent contentId={id} contentType={contentType} />
    </Stack>
  );
}
