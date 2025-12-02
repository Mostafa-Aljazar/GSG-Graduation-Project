'use client';

import { TDisplacedsFilterFormValues } from '@/validations/actor/general/displaceds/displaceds-filter-form.schema';
import { createContext, useContext, useState, ReactNode } from 'react';

type DisplacedsContextType = {
  localFilters: TDisplacedsFilterFormValues;
  setLocalFilters: (v: TDisplacedsFilterFormValues) => void;
  displacedNum: number;
  setDisplacedNum: (v: number) => void;
};

const DisplacedsContext = createContext<DisplacedsContextType | null>(null);

export function DisplacedsProvider({ children }: { children: ReactNode }) {
  const [localFilters, setLocalFilters] = useState<TDisplacedsFilterFormValues>({
    wifeStatus: null,
    familyNumber: null,
    ages: [],
    chronicDisease: null,
    accommodationType: null,
    familyStatusType: null,
    delegate: [],
  });

  const [displacedNum, setDisplacedNum] = useState(0);

  return (
    <DisplacedsContext.Provider
      value={{
        localFilters,
        setLocalFilters,
        displacedNum,
        setDisplacedNum,
      }}
    >
      {children}
    </DisplacedsContext.Provider>
  );
}

export function useDisplaceds() {
  const ctx = useContext(DisplacedsContext);
  if (!ctx) throw new Error('useDisplaceds must be used inside DisplacedsProvider');
  return ctx;
}
