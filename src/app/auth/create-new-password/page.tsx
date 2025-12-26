import CreateNewPasswordComponent from '@/components/auth/create-new-password-component';
import { APP_URL } from '@/constants';
import { AUTH_ROUTES } from '@/constants/routes';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'إنشاء كلمة مرور جديدة | AL-AQSA Camp',
  description:
    'قم بإنشاء كلمة مرور جديدة لحسابك في منصة مخيم الأقصى بعد التحقق من البريد الإلكتروني.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'إنشاء كلمة مرور جديدة | AL-AQSA Camp',
    description:
      'قم بإنشاء كلمة مرور جديدة لحسابك في منصة مخيم الأقصى بعد التحقق من البريد الإلكتروني.',
    url: APP_URL + AUTH_ROUTES.CREATE_NEW_PASSWORD,
    siteName: 'AL-AQSA Camp',
    images: [
      {
        url: '/favicon.ico',
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
    title: 'إنشاء كلمة مرور جديدة | AL-AQSA Camp',
    description:
      'قم بإنشاء كلمة مرور جديدة لحسابك في منصة مخيم الأقصى بعد التحقق من البريد الإلكتروني.',
    images: ['/favicon.ico'],
  },
};

export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewPasswordComponent />
    </Suspense>
  );
}
