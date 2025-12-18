import { IMG_FAVICON } from '@/assets/common';
import { IMG_HOME_CHILD } from '@/assets/landing/home';
import ChildSection from '@/components/landing/common/child-section';
import HeroSection from '@/components/landing/common/hero-section';
import DonationForm from '@/components/landing/donation/donation-form';
import Services from '@/components/landing/home/services';
import Statistics from '@/components/landing/home/statistics';
import { LANDING_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';
import { Metadata } from 'next';

const FALLBACK = {
  TITLE: 'الصفحة الرئيسية | AL-AQSA Camp',
  DESCRIPTION: 'تابع أحدث الأخبار، الخدمات، والإحصائيات على منصة مخيم الأقصى للنازحين',
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
    url: `${APP_URL + LANDING_ROUTES.HOME}`,
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
      <DonationForm />
    </>
  );
}
