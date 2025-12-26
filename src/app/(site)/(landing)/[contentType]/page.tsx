import { IMG_BLOG_CHILD } from '@/assets/landing/blog';
import OurWrittenContent from '@/components/landing/written-content/our-written-content';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import { DESTINATION_HERO_SECTION, TYPE_BLOG_OR_SUCCESS_STORIES } from '@/types/landing/index.type';
import { Suspense } from 'react';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IMG_FAVICON } from '@/assets/common';
import { Metadata } from 'next';
import { APP_URL } from '@/constants/';
import { LANDING_ROUTES } from '@/constants/routes';

interface IWrittenContentPageProps {
  params: Promise<{ contentType: TYPE_BLOG_OR_SUCCESS_STORIES }>;
}

const FALLBACK = {
  TITLE: 'المقالات و قصص النجاح | AL-AQSA Camp',
  DESCRIPTION: 'تابع أحدث المقالات والقصص على منصة مخيم الأقصى للنازحين',
  IMAGE: IMG_FAVICON.src,
};

export const metadata: Metadata = {
  title: FALLBACK.TITLE,
  description: FALLBACK.DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    siteName: 'AL-AQSA Camp',
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    url: `${APP_URL + LANDING_ROUTES.BLOG}`,
    images: [
      {
        url: FALLBACK.IMAGE,
        width: 64,
        height: 64,
        alt: 'AL-AQSA Camp favicon',
      },
    ],
    locale: 'ar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    images: [FALLBACK.IMAGE],
  },
};

export default async function WrittenContentPage({ params }: IWrittenContentPageProps) {
  const { contentType } = await params;

  const destinationHero =
    contentType === TYPE_BLOG_OR_SUCCESS_STORIES.BLOG
      ? DESTINATION_HERO_SECTION.BLOG
      : DESTINATION_HERO_SECTION.SUCCESS_STORIES;

  const destinationBlogOrStories =
    contentType === TYPE_BLOG_OR_SUCCESS_STORIES.BLOG
      ? TYPE_WRITTEN_CONTENT.BLOG
      : TYPE_WRITTEN_CONTENT.SUCCESS_STORIES;

  const childDescription = (
    <>
      النزوح <span className='text-red-500'>يسرق</span> الطفولة، لكنه لا يستطيع{' '}
      <span className='text-red-500'>قتل</span> البراءة
    </>
  );
  return (
    <>
      <HeroSection destination={destinationHero} />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <OurWrittenContent destination={destinationBlogOrStories} />
      </Suspense>

      <ChildSection childImage={IMG_BLOG_CHILD} desc={childDescription} />
    </>
  );
}
