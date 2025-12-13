import DisplacedProfileForm from '@/components/actor/displaceds/profile/displaced-profile-form';

interface Props {
  params: Promise<{ displaced: string }>;
}

export default async function DisplacedProfile({ params }: Props) {
  const { displaced } = await params;
  const displacedId = displaced;

  return <DisplacedProfileForm displacedId={displacedId} />;
}
