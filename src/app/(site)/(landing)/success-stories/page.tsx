import { IMG_BLOG_CHILD } from '@/assets/landing/blog';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';

export default function Success_Story() {
  const childDescription = (
    <>
      النزوح <span className='text-red-500'>يسرق</span> الطفولة، لكنه لا يستطيع{' '}
      <span className='text-red-500'>قتل</span> البراءة
    </>
  );

  return (
    <>
      <HeroSection destination={DESTINATION_HERO_SECTION.SUCCESS_STORIES} />

      <ChildSection childImage={IMG_BLOG_CHILD} desc={childDescription} />
    </>
  );
}
