import { getDisplaceds } from '@/actions/actor/general/displaceds/getDisplaceds';
import { IMG_MAN } from '@/assets/actor';
import DisplacedsList from '@/components/actor/general/displaceds/view/displaceds-list';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Stack } from '@mantine/core';
import { Metadata } from 'next';

const FALLBACK = {
  TITLE: 'قائمة النازحين | AL-AQSA Camp',
  DESCRIPTION:
    'عرض جميع النازحين المسجلين في منصة مخيم الأقصى مع بياناتهم وحالاتهم الاجتماعية والمعيشية.',
  IMAGE: IMG_MAN.src,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getDisplaceds({ page: 1, limit: 1 });
    const totalDisplaceds = response?.pagination?.totalItems ?? 0;

    const title = `قائمة النازحين (${totalDisplaceds}) | AL-AQSA Camp`;
    const description = `عدد النازحين المسجلين: ${totalDisplaceds}. تصفح بيانات النازحين وحالاتهم في منصة مخيم الأقصى.`;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + GENERAL_ACTOR_ROUTES.DISPLACEDS,
        images: [{ url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Displaceds' }],
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
        url: APP_URL + GENERAL_ACTOR_ROUTES.DISPLACEDS,
        images: [{ url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Displaceds' }],
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

export default function DisplacedsPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <DisplacedsList />
    </Stack>
  );
}
