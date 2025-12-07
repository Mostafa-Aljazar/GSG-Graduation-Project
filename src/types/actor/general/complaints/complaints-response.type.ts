import { TUserRank, TUserType } from "@/constants/user-types";
import { IPagination } from "@/types/common/pagination.type";
import { COMPLAINTS_STATUS } from "../../common/index.type";


export interface IComplaint {
    id: number;
    date: Date | string;
    sender: { id: number, name: string, image: string, role: TUserType | TUserRank };
    receiver: { id: number, name: string, image: string, role: TUserType | TUserRank };
    title: string;
    body: string;
    status: COMPLAINTS_STATUS;
    response?: string
}


export interface IComplaintsResponse {
    status: number;
    message: string;
    error?: string;
    complaints: IComplaint[];
    pagination: IPagination
}
