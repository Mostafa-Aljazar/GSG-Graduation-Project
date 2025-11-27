import CreateNewPasswordComponent from '@/components/auth/create-new-password-component';
import { Suspense } from 'react';

export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewPasswordComponent />
    </Suspense>
  );
}
