import DelegateProfileForm from '@/components/actor/delegate/profile/delegate-profile-form';

interface Props {
  params: Promise<{ delegate: string }>;
}

export default async function DelegateProfile({ params }: Props) {
  const { delegate } = await params;
  const delegateId = Number(delegate);

  return <DelegateProfileForm delegateId={delegateId} />;
}
