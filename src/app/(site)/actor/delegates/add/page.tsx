import { IMG_MAN } from '@/assets/actor';
import DelegateProfileForm from '@/components/actor/delegates/profile/delegate-profile-form';
import { getDelegateRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إضافة مندوب جديد | AL-AQSA Camp',
  description: 'إضافة مندوب جديد إلى منصة مخيم الأقصى.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    siteName: 'AL-AQSA Camp',
    title: 'إضافة مندوب جديد | AL-AQSA Camp',
    description: 'إضافة مندوب جديد إلى منصة مخيم الأقصى.',
    type: 'website',
    url:
      APP_URL +
      getDelegateRoutes({
        delegateId: '',
      }).ADD_AID_DISPLACEDS,
    images: [{ url: IMG_MAN.src, width: 600, height: 600, alt: 'إضافة مندوب جديد' }],
    locale: 'ar',
  },
  twitter: {
    card: 'summary',
    title: 'إضافة مندوب جديد | AL-AQSA Camp',
    description: 'إضافة مندوب جديد إلى منصة مخيم الأقصى.',
    images: [IMG_MAN.src],
  },
};

export default function DelegateAdd() {
  return <DelegateProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
