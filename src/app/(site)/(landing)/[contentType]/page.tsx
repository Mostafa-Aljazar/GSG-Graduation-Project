import { IMG_BLOG_CHILD } from '@/assets/landing/blog';
import OurWrittenContent from '@/components/landing/written-content/our-written-content';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import {
  DESTINATION_HERO_SECTION,
  TYPE_BLOG_OR_SUCCESS_STORIES,
  TYPE_WRITTEN_CONTENT,
} from '@/types/landing/index.type';
import { Suspense } from 'react';

interface IWrittenContentPageProps {
  params: { contentType: TYPE_BLOG_OR_SUCCESS_STORIES };
}

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
