import { IMG_HOME_CHILD } from '@/assets/landing/home';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import Services from '@/components/landing/home/services';
import Statistics from '@/components/landing/home/statistics';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';

export default function Home() {
  const childDescription = (
    <>
      رغم <span className='text-red-600'>الألم</span> إلا أنه هناك دائماً
      <span className='text-green-600'> أمل </span> 💡
    </>
  );

  return (
    <>
      <HeroSection destination={DESTINATION_HERO_SECTION.HOME} />
      <Statistics />
      <Services />
      <ChildSection childImage={IMG_HOME_CHILD} desc={childDescription} />
    </>
  );
}
