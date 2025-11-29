import AddWrittenContentForm from '@/components/actor/manager/written-content/add/written-form/add-written-content-form';
import { Suspense } from 'react';

export default function AddWrittenContentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddWrittenContentForm />
    </Suspense>
  );
}
