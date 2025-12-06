import ManagerProfileForm from '@/components/actor/manager/profile/manager-profile-form';

interface Props {
  params: Promise<{ manager: string }>;
}

export default async function ManagerProfile({ params }: Props) {
  const { manager } = await params;
  const managerId = Number(manager);

  return <ManagerProfileForm managerId={managerId} />;
}
