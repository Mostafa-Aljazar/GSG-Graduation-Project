import { getDelegateProfile } from '@/actions/actor/delegates/profile/getDelegateProfile';
import { IMG_MAN } from '@/assets/actor';
import DelegateProfileForm from '@/components/actor/delegates/profile/delegate-profile-form';
import { getDelegateRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'الملف الشخصي للمندوب | AL-AQSA Camp',
  DESCRIPTION: 'تفاصيل الملف الشخصي للمندوبين على منصة مخيم الأقصى.',
  IMAGE: IMG_MAN.src,
};

interface Props {
  params: Promise<{ delegate: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { delegate: delegateId } = await params;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const res = await getDelegateProfile({ delegateId });
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
          url: APP_URL + getDelegateRoutes({ delegateId }).PROFILE,
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
      url: APP_URL + getDelegateRoutes({ delegateId }).PROFILE,
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

export default async function DelegateProfile({ params }: Props) {
  const { delegate } = await params;
  const delegateId = delegate;

  return <DelegateProfileForm delegateId={delegateId} />;
}
