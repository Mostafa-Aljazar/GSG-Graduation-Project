import { IMG_MAN } from '@/assets/actor';
import DisplacedProfileForm from '@/components/actor/displaceds/profile/displaced-profile-form';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إضافة نازح جديد | AL-AQSA Camp',
  description: 'إضافة نازح جديد إلى منصة مخيم الأقصى.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    siteName: 'AL-AQSA Camp',
    title: 'إضافة نازح جديد | AL-AقSA Camp',
    description: 'إضافة نازح جديد إلى منصة مخيم الأقصى.',
    type: 'website',
    url: APP_URL + GENERAL_ACTOR_ROUTES.ADD_DISPLACEDS,
    images: [{ url: IMG_MAN.src, width: 600, height: 600, alt: 'إضافة نازح جديد' }],
    locale: 'ar',
  },
  twitter: {
    card: 'summary',
    title: 'إضافة نازح جديد | AL-AQSA Camp',
    description: 'إضافة نازح جديد إلى منصة مخيم الأقصى.',
    images: [IMG_MAN.src],
  },
};

export default function DisplacedAdd() {
  return <DisplacedProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
