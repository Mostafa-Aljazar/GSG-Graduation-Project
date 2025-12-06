import { IPagination } from "@/types/common/pagination.type";

export interface IDelegate {
    id: number;
    name: string;
    identity: string;
    displacedNumber: number;
    familyNumber: number;
    mobileNumber: string;
    tentsNumber: number;
}

export interface IDelegatesResponse {
    status: number;
    message?: string;
    delegates: IDelegate[];
    error?: string;
    pagination: IPagination
}

export interface IDelegatesNamesResponse {
    status: number;
    message: string;
    delegateNames: {
        id: number;
        name: string
    }[];
    error?: string;
}

export interface IDelegatesIdsResponse {
    status: number;
    message?: string;
    delegatesIds: number[];
    error?: string;
}