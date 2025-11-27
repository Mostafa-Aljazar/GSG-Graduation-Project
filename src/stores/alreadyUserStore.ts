import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { USER_TYPE, USER_RANK } from '@/constants/user-types';

interface AlreadyUserStore {
    userId: number;
    userType: USER_TYPE | USER_RANK | null;
    setUser: (id: number, type: USER_TYPE | USER_RANK) => void;
    clearUser: () => void;
}

export const useAlreadyUserStore = create<AlreadyUserStore>()(
    persist<AlreadyUserStore>(
        (set) => ({
            userId: 0,
            userType: null,
            setUser: (id, type) => set({ userId: id, userType: type }),
            clearUser: () => set({ userId: 0, userType: null }),
        }),
        {
            name: 'already-user-storage',
            // optional: storage: localStorage, // default is localStorage in web
        }
    )
);
