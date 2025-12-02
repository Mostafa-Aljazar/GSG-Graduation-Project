'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { TAidsManagementFilterFormValues } from '@/validations/actor/common/aids-management/aids-management-filters-form.schema';

type AidsManagementContextType = {
  localFilters: TAidsManagementFilterFormValues;
  setLocalFilters: (filters: TAidsManagementFilterFormValues) => void;
  aidsNum: number;
  setAidsNum: (num: number) => void;
};

const AidsManagementContext = createContext<AidsManagementContextType | undefined>(undefined);

export function AidsManagementProvider({ children }: { children: ReactNode }) {
  const initialFilters: TAidsManagementFilterFormValues = {
    type: null,
    dateRange: [null, null],
    recipientsRange: [null, null],
  };

  const [localFilters, setLocalFilters] = useState<TAidsManagementFilterFormValues>(initialFilters);
  const [aidsNum, setAidsNum] = useState(0);

  return (
    <AidsManagementContext.Provider value={{ localFilters, setLocalFilters, aidsNum, setAidsNum }}>
      {children}
    </AidsManagementContext.Provider>
  );
}

export function useAidsManagement() {
  const context = useContext(AidsManagementContext);
  if (!context) throw new Error('useAidsManagement must be used within AidsManagementProvider');
  return context;
}
