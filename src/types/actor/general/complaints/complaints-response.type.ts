import { TUserRank, TUserType } from "@/constants/user-types";
import { COMPLAINTS_STATUS } from "../../common/index.type";


export interface IComplaint {
    id: number;
    date: string;
    sender: { id: number, name: string, image: string, role: TUserType | TUserRank };
    receiver: { id: number, name: string, image: string, role: TUserType | TUserRank };
    title: string;
    body: string;
    status: COMPLAINTS_STATUS;
}


export interface IComplaintResponse {
    status: number;
    message?: string;
    error?: string;
    complaints: IComplaint[];
    pagination: {
        page: number;
        limit: number;
        total_items: number;
        total_pages: number;
    };
}
