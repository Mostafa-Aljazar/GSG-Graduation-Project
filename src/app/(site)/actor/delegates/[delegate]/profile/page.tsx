interface Props {
  params: Promise<{ delegate: string }>;
}

export default async function DisplacedProfile({ params }: Props) {
  const { delegate } = await params;
  const delegateId = Number(delegate);

  return <>hi from delegate :{delegateId}</>;
}
