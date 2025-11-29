export interface Delegate {
    id: number;
    name: string;
    identity: string;
    displaced_number: number;
    family_number: number;
    mobile_number: string;
    tents_number: number;
}

export interface DelegatesResponse {
    status: number;
    message?: string;
    delegates: Delegate[];
    error?: string;
    pagination: {
        page: number;
        limit: number;
        total_items: number;
        total_pages: number;
    };
}

export interface DelegatesNamesResponse {
    status: number;
    message: string;
    delegate_names: {
        id: number;
        name: string
    }[];
    error?: string;
}

export interface DelegatesIdsResponse {
    status: number;
    message?: string;
    delegates_Ids: number[];
    error?: string;
}