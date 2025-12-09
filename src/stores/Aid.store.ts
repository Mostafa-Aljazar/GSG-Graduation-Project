'use client';

import { create } from 'zustand';
import {
    IBaseAidForm,
    ISelectedDelegatePortion,
    ICategoryRange,
    IReceivedDisplaceds,
} from '@/types/actor/common/aids-management/aids-management.types';
import {
    TYPE_GROUP_AIDS,
    INITIAL_AID_FORM_VALUES,
} from '@/types/actor/common/index.type';

interface AidStore {
    formValues: IBaseAidForm;
    selectedCategories: ICategoryRange[];

    selectedDisplacedIds: string[];
    selectedDelegatesPortions: ISelectedDelegatePortion[];
    receivedDisplaceds: IReceivedDisplaceds[];
    securitiesId: string[];
    isCompleted: boolean;
    aidStatus: TYPE_GROUP_AIDS;

    /** Category management */
    addCategory: (cat: ICategoryRange) => void;
    updateCategory: (id: string, updated: Partial<ICategoryRange>) => void;
    removeCategory: (id: string) => void;
    resetCategories: () => void;

    /** Form updates */
    setFormValues: (values: Partial<IBaseAidForm>) => void;

    /** Displaced & delegates */
    setSelectedDisplacedIds: (ids: string[]) => void;
    setSelectedDelegatesPortions: (portions: ISelectedDelegatePortion[]) => void;
    setReceivedDisplaceds: (items: IReceivedDisplaceds[]) => void;
    setSecuritiesId: (ids: string[]) => void;
    setIsCompleted: (completed: boolean) => void;
    setAidStatus: (status: TYPE_GROUP_AIDS) => void;

    addDisplacedId: (id: string) => void;
    removeDisplacedId: (id: string) => void;
    updateDelegatePortion: (delegateId: string, portion: number) => void;
    addReceivedDisplaced: (item: IReceivedDisplaceds) => void;
    removeReceivedDisplaced: (displacedId: string) => void;

    resetAidStore: () => void;
}

export const useAidStore = create<AidStore>((set, get) => ({
    formValues: INITIAL_AID_FORM_VALUES,
    selectedCategories: [],

    selectedDisplacedIds: [],
    selectedDelegatesPortions: [],
    receivedDisplaceds: [],
    securitiesId: [],
    isCompleted: false,
    aidStatus: TYPE_GROUP_AIDS.ONGOING_AIDS,

    addCategory: (cat) => {
        set({ selectedCategories: [...get().selectedCategories, cat] });
    },

    updateCategory: (id, updated) => {
        const cat = get().selectedCategories.find((c) => c.id === id);
        if (cat?.isDefault) return; // cannot edit default category
        set({
            selectedCategories: get().selectedCategories.map((c) =>
                c.id === id ? { ...c, ...updated } : c
            ),
        });
    },

    removeCategory: (id) => {
        set({
            selectedCategories: get().selectedCategories.filter((c) => c.id !== id),
        });
    },

    resetCategories: () => set({ selectedCategories: [] }),
    // resetCategories: () => set({ selectedCategories: [...DEFAULT_CATEGORIES] }),

    setFormValues: (values) =>
        set({
            formValues: {
                ...get().formValues,
                ...values,
                selectedCategories: get().selectedCategories,
            },
        }),

    setSelectedDisplacedIds: (ids) => set({ selectedDisplacedIds: ids }),
    setSelectedDelegatesPortions: (portions) => set({ selectedDelegatesPortions: portions }),
    setReceivedDisplaceds: (items) => set({ receivedDisplaceds: items }),
    setSecuritiesId: (ids) => set({ securitiesId: ids }),
    setIsCompleted: (completed) => set({ isCompleted: completed }),
    setAidStatus: (status) => set({ aidStatus: status }),

    addDisplacedId: (id) => set({ selectedDisplacedIds: [...get().selectedDisplacedIds, id] }),
    removeDisplacedId: (id) =>
        set({ selectedDisplacedIds: get().selectedDisplacedIds.filter((d) => d !== id) }),

    updateDelegatePortion: (delegateId, portion) =>
        set({
            selectedDelegatesPortions: get().selectedDelegatesPortions.map((item) =>
                item.delegateId === delegateId ? { ...item, portion } : item
            ),
        }),

    addReceivedDisplaced: (item) =>
        set({ receivedDisplaceds: [...get().receivedDisplaceds, item] }),
    removeReceivedDisplaced: (displacedId) =>
        set({
            receivedDisplaceds: get().receivedDisplaceds.filter((d) => d.displacedId !== displacedId),
        }),

    resetAidStore: () =>
        set({
            formValues: INITIAL_AID_FORM_VALUES,
            selectedCategories: [],
            selectedDisplacedIds: [],
            selectedDelegatesPortions: [],
            receivedDisplaceds: [],
            securitiesId: [],
            isCompleted: false,
            aidStatus: TYPE_GROUP_AIDS.ONGOING_AIDS,
        }),
}));
