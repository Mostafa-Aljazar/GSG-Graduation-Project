import { ReactNode } from 'react';
import Mantine_Provider from './mantine-provider';
import Nuqs_Adapter from './nuqs-adapter';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Nuqs_Adapter>
      <Mantine_Provider>
        <>{children}</>
      </Mantine_Provider>
    </Nuqs_Adapter>
  );
}
