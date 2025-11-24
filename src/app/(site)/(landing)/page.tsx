import { IMG_HOME_CHILD } from '@/assets/landing/home';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import Services from '@/components/landing/home/services';
import Statistics from '@/components/landing/home/statistics';

export default function Home() {
  const childDescription = (
    <>
      رغم <span className='text-red-600'>الألم</span> إلا أنه هناك دائماً
      <span className='text-green-600'> أمل </span> 💡
    </>
  );

  return (
    <>
      <HeroSection />
      <Statistics />
      <Services />
      <ChildSection child_image={IMG_HOME_CHILD} desc={childDescription} />
    </>
  );
}
