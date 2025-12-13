import { IPagination } from "@/types/common/pagination.type";
import {
    DISTRIBUTION_MECHANISM,
    QUANTITY_AVAILABILITY,
    TYPE_AIDS,
    TYPE_GROUP_AIDS,
} from "../index.type";

//////////////////////////////////////////////////////
// CATEGORY RANGE
//////////////////////////////////////////////////////

export interface ICategoryRange {
    id: string;
    label: string;
    min: number;
    max: number | null;
    isDefault?: boolean;
    portion?: number;
}

//////////////////////////////////////////////////////
// DELEGATE PORTIONS
//////////////////////////////////////////////////////

export interface ISelectedDelegatePortion {
    delegateId: string;
    portion: number;
}

//////////////////////////////////////////////////////
// BASE AID FORM (used in Add + Edit)
//////////////////////////////////////////////////////

export interface IBaseAidForm {
    aidName: string;
    aidType: TYPE_AIDS;
    aidContent: string;
    deliveryDate: Date | null;
    deliveryLocation: string;
    securityRequired: boolean;
    quantityAvailability: QUANTITY_AVAILABILITY;
    existingQuantity?: number;
    selectedCategories: ICategoryRange[];
    additionalNotes?: string;
    distributionMechanism: DISTRIBUTION_MECHANISM;
}

//////////////////////////////////////////////////////
// FINAL AID ENTITY (Saved in DB)
//////////////////////////////////////////////////////

export type TAid = IBaseAidForm & {
    id: string;
    selectedDisplacedIds: string[];
    selectedDelegatesPortions?: ISelectedDelegatePortion[];
    receivedDisplaceds: IReceivedDisplaceds[];
    securitiesId: string[];
    isCompleted: boolean;
    aidStatus: TYPE_GROUP_AIDS;
};

//////////////////////////////////////////////////////
// RECEIVED ITEMS
//////////////////////////////////////////////////////

export interface IReceivedDisplaceds {
    displacedId: string;
    receivedTime: Date | string;
}

//////////////////////////////////////////////////////
// API RESPONSES
//////////////////////////////////////////////////////

export interface IAidResponse {
    status: number;
    message?: string;
    aid: TAid;
    error?: string;
}

export interface IAidsResponse {
    status: number;
    message?: string;
    aids: TAid[];
    error?: string;
    pagination: IPagination;
}
