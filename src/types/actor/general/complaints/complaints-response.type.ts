import { TUserRank, TUserType } from "@/constants/user-types";
import { IPagination } from "@/types/common/pagination.type";
import { COMPLAINTS_STATUS } from "../../common/index.type";


export interface IComplaint {
    id: string;
    date: Date | string;
    sender: { id: string, name: string, image: string, role: TUserType | TUserRank };
    receiver: { id: string, name: string, image: string, role: TUserType | TUserRank };
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
