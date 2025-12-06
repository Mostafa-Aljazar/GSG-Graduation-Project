import { DisplacedProfileForm } from '@/components';

interface Props {
  params: Promise<{ displaced: string }>;
}

export default async function DisplacedProfile({ params }: Props) {
  const { displaced } = await params;
  const displacedId = Number(displaced);

  return <DisplacedProfileForm displacedId={displacedId} />;
}
