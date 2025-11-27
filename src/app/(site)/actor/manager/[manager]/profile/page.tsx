interface Props {
  params: Promise<{ manager: string }>;
}

export default async function ManagerProfile({ params }: Props) {
  const { manager } = await params;
  const managerId = Number(manager);

  return <>hi from Manager :{managerId}</>;
}
