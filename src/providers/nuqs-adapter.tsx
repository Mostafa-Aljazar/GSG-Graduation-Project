import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

export default function Nuqs_Adapter({ children }: { children: ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
