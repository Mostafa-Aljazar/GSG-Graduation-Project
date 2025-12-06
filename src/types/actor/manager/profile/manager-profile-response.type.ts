import { USER_TYPE } from "@/constants/user-types";
import { GENDER, SOCIAL_STATUS } from "../../common/index.type";

export interface IManagerProfile {
    id?: number; //HINT: optional in create manager
    name: string
    email: string
    gender: GENDER
    profileImage?: string
    identity: string
    nationality: string;
    socialStatus: SOCIAL_STATUS
    mobileNumber: string
    alternativeMobileNumber?: string
    role: USER_TYPE.MANAGER
    rank: USER_TYPE.MANAGER
}

export interface IManagerProfileResponse {
    status: number;
    message?: string;
    user: IManagerProfile;
    error?: string;
}