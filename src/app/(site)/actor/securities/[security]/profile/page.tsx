import SecurityProfileForm from '@/components/actor/securities/profile/security-profile-form';

interface ISecurityProfileProps {
  params: Promise<{ security: string }>;
}

export default async function SecurityProfile({ params }: ISecurityProfileProps) {
  const { security } = await params;
  const securityId = security;

  return <SecurityProfileForm securityId={securityId} />;
}
