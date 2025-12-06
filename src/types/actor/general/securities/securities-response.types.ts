import { IPagination } from "@/types/common/pagination.type";

export interface ISecurity {
    id: number;
    name: string;
    identity: string;
    mobileNumber: string;
    rank: "SECURITY_PERSON" | "SECURITY_OFFICER"
}

export interface ISecuritiesResponse {
    status: number;
    message?: string;
    securities: ISecurity[];
    error?: string;
    pagination: IPagination
}


export interface ISecuritiesNamesResponse {
    status: number;
    message: string;
    securitiesNames: {
        id: number;
        name: string
    }[];
    error?: string;
}
export interface ISecurityIdsResponse {
    status: number;
    message?: string;
    securitiesIds: number[];
    error?: string;
}
