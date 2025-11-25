import OurBlog from '@/components/landing/blog/our-blog';
import HeroSection from '@/components/landing/common/hero-section';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';
import { Suspense } from 'react';

export default function Blog() {
  return (
    <>
      <HeroSection destination={DESTINATION_HERO_SECTION.BLOG} />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <OurBlog />
      </Suspense>
    </>
  );
}
