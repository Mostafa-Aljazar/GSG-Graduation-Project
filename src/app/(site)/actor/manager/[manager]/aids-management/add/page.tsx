import { Suspense } from 'react';
import AddAidController from '@/components/actor/common/aids-management/add/add-aid-controller';

export default function ManagerAddAidPage() {
  return (
    <Suspense fallback={<div className='p-8 text-center'>جاري التحميل...</div>}>
      <AddAidController />
    </Suspense>
  );
}
