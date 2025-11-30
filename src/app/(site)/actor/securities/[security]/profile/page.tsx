interface ISecurityProfileProps {
  params: Promise<{ security: string }>;
}

export default async function SecurityProfile({ params }: ISecurityProfileProps) {
  const { security } = await params;
  const securityId = Number(security);

  return <>Hi from SecurityProfile {securityId}</>;
}
