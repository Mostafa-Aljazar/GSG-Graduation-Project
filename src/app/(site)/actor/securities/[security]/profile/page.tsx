import { getSecurityProfile } from '@/actions/actor/securities/profile/getSecurityProfile';
import { IMG_MAN } from '@/assets/actor';
import SecurityProfileForm from '@/components/actor/securities/profile/security-profile-form';
import { getSecurityRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { Metadata, ResolvingMetadata } from 'next';

interface ISecurityProfileProps {
  params: Promise<{ security: string }>;
}

const FALLBACK = {
  TITLE: 'الملف الشخصي للحارس | AL-AQSA Camp',
  DESCRIPTION: 'تفاصيل الملف الشخصي للحراس على منصة مخيم الأقصى.',
  IMAGE: IMG_MAN.src,
};

export async function generateMetadata(
  { params }: ISecurityProfileProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { security: securityId } = await params;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const res = await getSecurityProfile({ securityId });
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
          url: APP_URL + getSecurityRoutes({ securityId }).PROFILE,
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
      url: APP_URL + getSecurityRoutes({ securityId }).PROFILE,
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

export default async function SecurityProfile({ params }: ISecurityProfileProps) {
  const { security } = await params;
  const securityId = security;

  return <SecurityProfileForm securityId={securityId} />;
}
