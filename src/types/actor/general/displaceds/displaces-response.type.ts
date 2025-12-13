import { IPagination } from "@/types/common/pagination.type";

export interface IDisplaced {
    id: string;
    name: string;
    identity: string;
    tent: string;
    familyNumber: number;
    mobileNumber: string;
    delegate: IHisDelegate;
}

export interface IHisDelegate {
    id: string;
    name: string;
}

export interface IDisplacedsResponse {
    status: number;
    message?: string;
    displaceds: IDisplaced[];
    error?: string;
    pagination: IPagination
}


export interface IDisplacedsNamesResponse {
    status: number;
    message: string;
    displacedsNames: {
        id: string;
        name: string
    }[];
    error?: string;
}



export interface IDisplacedsIdsResponse {
    status: number;
    message?: string;
    displacedsIds: string[];
    error?: string;
}