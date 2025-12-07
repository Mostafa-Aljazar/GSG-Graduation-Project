'use client';

import { COMPLAINTS_STATUS } from '@/types/actor/common/index.type';
import { TComplaintFilterFormValues } from '@/validations/actor/general/complaints/complaints.schema';
import { createContext, useContext, useState, ReactNode } from 'react';

type TComplaintsContextType = {
  localFilters: TComplaintFilterFormValues;
  setLocalFilters: (v: TComplaintFilterFormValues) => void;
  complaintsNum: number;
  setComplaintsNum: (v: number) => void;
};

const ComplaintsContext = createContext<TComplaintsContextType | null>(null);

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const [localFilters, setLocalFilters] = useState<TComplaintFilterFormValues>({
    status: COMPLAINTS_STATUS.ALL,
    dateRange: [null, null],
  });
  const [complaintsNum, setComplaintsNum] = useState(0);

  return (
    <ComplaintsContext.Provider
      value={{
        localFilters,
        setLocalFilters,
        complaintsNum,
        setComplaintsNum,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaintsStore() {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error('useComplaints must be used inside ComplaintsProvider');
  return ctx;
}
