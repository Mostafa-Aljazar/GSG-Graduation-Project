import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DonationState = {
  name: string;
  email: string;
  price: number;
  message: string;
  setDonationData: (data: Partial<DonationState>) => void;
  resetDonation: () => void;
};

export const useDonationStore = create(
  persist<DonationState>(
    (set) => ({
      name: '',
      email: '',
      price: 10,
      message: '',
      setDonationData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
      resetDonation: () =>
        set({
          name: '',
          email: '',
          price: 0,
          message: '',
        }),
    }),
    {
      name: 'donation-store',
    }
  )
);
