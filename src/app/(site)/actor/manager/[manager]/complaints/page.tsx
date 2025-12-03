import { USER_RANK } from '@/constants/user-types';
import type { Metadata, ResolvingMetadata } from 'next';
import { generateActorComplaintsMetadata } from '@/utils/metadata/actor-complaints-wrapper';
import ActorComplaintsWrapper from '@/components/complaints-view/ActorComplaintsWrapper';
import { getManagerRoutes } from '@/constants/routes';

// import { FAVICON } from '@/assets/common';


interface Props {
  params: { manager: string };
}

const FALLBACK = {
  TITLE: 'شكاوى المديرين | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع الشكاوى المرسلة والمستقبلة الخاصة بالمديرين في منصة مخيم الأقصى.',
    IMAGE: 'https://example.com/favicon.png',
    // IMAGE: FAVICON.src,
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { manager } = await params;

  const managerId = Number(manager);


  
  return generateActorComplaintsMetadata(
    {
      actor_Id: managerId,
      role: USER_RANK.MANAGER,
      routeFunc: getManagerRoutes,
      actorName: 'المدير',
      FALLBACK,
    },
    parent
  );
}


export default async function Page({ params }: { params: { manager: string } }) {
    const { manager } = await params;

  const managerId = Number(manager);

  return (
    <>
    <ActorComplaintsWrapper
      actor_Id={managerId}
      rank={USER_RANK.MANAGER}
    />
    
    </>
  );
}
