import LoginComponent from '@/components/auth/login-component';
import { APP_URL } from '@/constants/';
import { AUTH_ROUTES } from '@/constants/routes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | AL-AQSA Camp',
  description: 'صفحة تسجيل الدخول لتطبيق مخيم الأقصى للنازحين. أدخل بياناتك للوصول إلى حسابك.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'تسجيل الدخول | AL-AQSA Camp',
    description: 'صفحة تسجيل الدخول لتطبيق مخيم الأقصى للنازحين.',
    url: APP_URL + AUTH_ROUTES.LOGIN,
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
    title: 'تسجيل الدخول | AL-AQSA Camp',
    description: 'صفحة تسجيل الدخول لتطبيق مخيم الأقصى للنازحين.',
    images: ['/favicon.ico'],
  },
};

export default function LoginPage() {
  return <LoginComponent />;
}
