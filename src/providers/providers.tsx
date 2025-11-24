import { ReactNode } from 'react';
import Mantine_Provider from './mantine-provider';
import Nuqs_Adapter from './nuqs-adapter';
import ReactQueryProvider from './react-query-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Nuqs_Adapter>
      <ReactQueryProvider>
        <Mantine_Provider>{children}</Mantine_Provider>
      </ReactQueryProvider>
    </Nuqs_Adapter>
  );
}
