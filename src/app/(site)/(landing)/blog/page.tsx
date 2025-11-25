import HeroSection from '@/components/landing/common/hero-section';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';

export default function Blog() {
  return (
    <>
      <HeroSection destination={DESTINATION_HERO_SECTION.BLOG} />
    </>
  );
}
