import { getDelegates } from '@/actions/actor/general/delegates/getDelegates';
import { IMG_MAN } from '@/assets/actor';
import DelegatesList from '@/components/actor/general/delegates/view/delegates-list';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Stack } from '@mantine/core';
import { Metadata } from 'next';

const FALLBACK = {
  TITLE: 'قائمة المندوبين | AL-AQSA Camp',
  DESCRIPTION:
    'عرض جميع المندوبين المسجلين في منصة مخيم الأقصى مع بياناتهم وعدد العائلات التي يشرفون عليها.',
  IMAGE: IMG_MAN.src,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getDelegates({ page: 1, limit: 1 });
    const totalDelegates = response?.pagination?.totalItems || 0;

    const title = `قائمة المندوبين (${totalDelegates}) | AL-AQSA Camp`;
    const description = `عدد المندوبين المسجلين: ${totalDelegates}. تصفح بيانات المندوبين والعائلات التي يشرفون عليها في منصة مخيم الأقصى.`;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + GENERAL_ACTOR_ROUTES.DELEGATES,
        images: [{ url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Delegates' }],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [FALLBACK.IMAGE],
      },
    };
  } catch {
    return {
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        type: 'website',
        url: APP_URL + GENERAL_ACTOR_ROUTES.DELEGATES,
        images: [{ url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Delegates' }],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        images: [FALLBACK.IMAGE],
      },
    };
  }
}

export default function DelegatesPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <DelegatesList />
    </Stack>
  );
}
