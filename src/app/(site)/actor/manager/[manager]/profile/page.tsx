import { getManagerProfile } from '@/actions/actor/manager/profile/getManagerProfile';
import { IMG_MAN } from '@/assets/actor';
import ManagerProfileForm from '@/components/actor/manager/profile/manager-profile-form';
import { getManagerRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Metadata, ResolvingMetadata } from 'next';

interface IManagerProfileProps {
  params: Promise<{ manager: string }>;
}
const FALLBACK = {
  TITLE: 'الملف الشخصي للمدير | AL-AQSA Camp',
  DESCRIPTION: 'تفاصيل الملف الشخصي لمدير مخيم الأقصى.',
  IMAGE: IMG_MAN.src,
};

interface IManagerProfileProps {
  params: Promise<{ manager: string }>;
}

export async function generateMetadata(
  { params }: IManagerProfileProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager: managerId } = await params;
  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const res = await getManagerProfile({ managerId });
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
          url: APP_URL + getManagerRoutes({ managerId }).PROFILE,
          images: [...previousImages, { url: image, width: 600, height: 600, alt: user.name }],
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
      url: APP_URL + getManagerRoutes({ managerId }).PROFILE,
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

export default async function ManagerProfile({ params }: IManagerProfileProps) {
  const { manager } = await params;
  const managerId = manager;

  return <ManagerProfileForm managerId={managerId} />;
}
