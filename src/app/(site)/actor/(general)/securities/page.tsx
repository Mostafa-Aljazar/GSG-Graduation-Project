import { getSecuritiesIds } from '@/actions/actor/general/security-data/getSecuritiesIds';
import { IMG_MAN } from '@/assets/actor';
import SecuritiesList from '@/components/actor/general/securities/view/securities-list';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { APP_URL } from '@/constants/services';
import { Stack } from '@mantine/core';
import { Metadata } from 'next';

const FALLBACK = {
  TITLE: 'بيانات الأمن | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع بيانات أفراد الأمن المسجلين في منصة مخيم الأقصى مع مهامهم ومعلوماتهم.',
  IMAGE: IMG_MAN.src,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getSecuritiesIds();
    const totalSecurities = response?.securitiesIds.length || 0;

    const title = `بيانات الأمن (${totalSecurities}) | AL-AQSA Camp`;
    const description = `عدد أفراد الأمن المسجلين: ${totalSecurities}. تصفح بيانات الأمن ومهامهم في منصة مخيم الأقصى.`;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + GENERAL_ACTOR_ROUTES.SECURITIES,
        images: [
          {
            url: FALLBACK.IMAGE,
            width: 600,
            height: 600,
            alt: 'Security Data',
          },
        ],
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
        url: APP_URL + GENERAL_ACTOR_ROUTES.SECURITIES,
        images: [
          {
            url: FALLBACK.IMAGE,
            width: 600,
            height: 600,
            alt: 'Security Data',
          },
        ],
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

export default function SecuritiesPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <SecuritiesList />
    </Stack>
  );
}
