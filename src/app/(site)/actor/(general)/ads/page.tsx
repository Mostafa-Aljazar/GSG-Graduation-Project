import { IMG_FAVICON } from '@/assets/common';
import AdsView from '@/components/actor/general/ads/ads-component';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Metadata } from 'next';

const FALLBACK = {
  TITLE: 'الإعلانات | AL-AQSA Camp',
  DESCRIPTION: 'شاهد أحدث الإعلانات والمحتوى المقدم على منصة مخيم الأقصى للنازحين.',
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
    type: 'website',
    url: APP_URL + GENERAL_ACTOR_ROUTES.ADS,
    images: [
      {
        url: FALLBACK.IMAGE,
        width: 64,
        height: 64,
        alt: FALLBACK.TITLE,
      },
    ],
    locale: 'ar',
  },
  twitter: {
    card: 'summary',
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    images: [FALLBACK.IMAGE],
  },
};

export default function AdsPage() {
  return <AdsView />;
}
