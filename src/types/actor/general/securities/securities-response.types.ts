import { IPagination } from "@/types/common/pagination.type";

export interface ISecurity {
    id: string;
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

export interface ISecuritiesName {
    id: string;
    name: string
}

export interface ISecuritiesNamesResponse {
    status: number;
    message: string;
    securitiesNames: ISecuritiesName[];
    error?: string;
}
export interface ISecurityIdsResponse {
    status: number;
    message?: string;
    securitiesIds: string[];
    error?: string;
}
