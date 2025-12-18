import { IMG_MAN } from '@/assets/actor';
import SecurityProfileForm from '@/components/actor/securities/profile/security-profile-form';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إضافة عنصر أمني جديد | AL-AQSA Camp',
  description: 'إضافة عنصر أمني جديد إلى منصة مخيم الأقصى.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    siteName: 'AL-AQSA Camp',
    title: 'إضافة عنصر أمني جديد | AL-AQSA Camp',
    description: 'إضافة عنصر أمني جديد إلى منصة مخيم الأقصى.',
    type: 'website',
    url: APP_URL + GENERAL_ACTOR_ROUTES.ADD_SECURITIES,
    images: [{ url: IMG_MAN.src, width: 600, height: 600, alt: 'إضافة عنصر أمني جديد' }],
    locale: 'ar',
  },
  twitter: {
    card: 'summary',
    title: 'إضافة عنصر أمني جديد | AL-AQSA Camp',
    description: 'إضافة عنصر أمني جديد إلى منصة مخيم الأقصى.',
    images: [IMG_MAN.src],
  },
};

export default function AddSecurityPage() {
  return <SecurityProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
