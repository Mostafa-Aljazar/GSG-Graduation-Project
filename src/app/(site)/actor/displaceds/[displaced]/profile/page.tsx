import { getDisplacedProfile } from '@/actions/actor/displaceds/profile/getDisplacedProfile';
import DisplacedProfileForm from '@/components/actor/displaceds/profile/displaced-profile-form';
import { getDisplacedRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'الملف الشخصي للنازح | AL-AQSA Camp',
  DESCRIPTION: 'تفاصيل الملف الشخصي للنازحين على منصة مخيم الأقصى.',
  IMAGE: '/favicon.ico',
};

interface Props {
  params: Promise<{ displaced: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { displaced: displacedId } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const res = await getDisplacedProfile({ displacedId });
    const user = res?.status === 200 ? res.user : null;

    if (user) {
      const title = `الملف الشخصي: ${user.name} | AL-AQSA Camp`;
      const description = `عرض تفاصيل ${user.name} في مخيم الأقصى`;
      const image = user.profileImage || FALLBACK.IMAGE;

      return {
        title,
        description,
        metadataBase: new URL(APP_URL),
        openGraph: {
          siteName: 'AL-AQSA Camp',
          title,
          description,
          type: 'profile',
          url: APP_URL + getDisplacedRoutes({ displacedId }).PROFILE,
          images: [{ url: image, width: 600, height: 600, alt: user.name }, ...previousImages],
          locale: 'ar',
        },
        twitter: {
          card: 'summary',
          title,
          description,
          images: [image],
        },
      };
    }
  } catch {}

  return {
    title: FALLBACK.TITLE,
    description: FALLBACK.DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: 'AL-AQSA Camp',
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      type: 'profile',
      url: APP_URL + getDisplacedRoutes({ displacedId }).PROFILE,
      images: [
        { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'AL-AQSA Camp' },
        ...previousImages,
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
}

export default async function DisplacedProfile({ params }: Props) {
  const { displaced } = await params;
  const displacedId = displaced;

  return <DisplacedProfileForm displacedId={displacedId} />;
}
