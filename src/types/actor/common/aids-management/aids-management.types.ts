import { IPagination } from "@/types/common/pagination.type";
import { DELEGATE_PORTIONS, DISTRIBUTION_MECHANISM, DISTRIBUTION_METHOD, QUANTITY_AVAILABILITY, TYPE_AIDS, TYPE_GROUP_AIDS } from "../index.type";


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
    delegateId: number;
    portion: number;
}

//////////////////////////////////////////////////////
// BASE AID FORM
//////////////////////////////////////////////////////

export interface IBaseAidForm {
    aidName: string;
    aidType: TYPE_AIDS;
    aidContent: string;
    deliveryDate: Date | null;
    deliveryLocation: string;
    securityRequired: boolean;
    quantityAvailability: QUANTITY_AVAILABILITY;
    existingQuantity: number;
    displacedSinglePortion: number;
    selectedCategories: ICategoryRange[];
    distributionMethod: DISTRIBUTION_METHOD;
    additionalNotes: string;
}

//////////////////////////////////////////////////////
// CONDITIONAL FORMS (Discriminated Unions)
//////////////////////////////////////////////////////

export interface IDelegateAidForm extends IBaseAidForm {
    distributionMechanism: DISTRIBUTION_MECHANISM.DELEGATES_LISTS;
    delegatesPortions: DELEGATE_PORTIONS;
    delegateSinglePortion?: number;
}

export interface IDirectAidForm extends IBaseAidForm {
    distributionMechanism: DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES;
}

export type TAddAidFormValues = IDelegateAidForm | IDirectAidForm;

//////////////////////////////////////////////////////
// RECEIVED ITEMS
//////////////////////////////////////////////////////

export interface IReceivedDisplaceds {
    displacedId: number;
    receivedTime: Date;
}

//////////////////////////////////////////////////////
// FINAL AID ENTITY
//////////////////////////////////////////////////////

export type TAid = TAddAidFormValues & {
    id: number;
    selectedDisplacedIds: number[];
    selectedDelegatesPortions?: ISelectedDelegatePortion[];
    receivedDisplaceds: IReceivedDisplaceds[];
    securitiesId?: number[];
    isCompleted: boolean;
    aidStatus: TYPE_GROUP_AIDS;
};

//////////////////////////////////////////////////////
// API RESPONSE TYPES
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
