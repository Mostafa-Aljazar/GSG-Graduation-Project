import { IPagination } from "@/types/common/pagination.type";

export interface IDelegate {
    id: string;
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
        id: string;
        name: string
    }[];
    error?: string;
}

export interface IDelegatesIdsResponse {
    status: number;
    message?: string;
    delegatesIds: string[];
    error?: string;
}