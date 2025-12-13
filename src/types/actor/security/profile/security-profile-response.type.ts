import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { IBaseProfile } from "../../common/user/base-profile.type";
import { SOCIAL_STATUS } from "../../common/index.type";

// ----------------- SECURITY -----------------
export interface ISecurityProfile extends IBaseProfile {
    role: USER_TYPE.SECURITY_PERSON;
    rank: USER_RANK.SECURITY_PERSON | USER_RANK.SECURITY_OFFICER;
    socialStatus: SOCIAL_STATUS;
    additionalNotes?: string;
}

export interface ISecurityProfileResponse {
    status: number;
    message: string;
    user: ISecurityProfile;
    error?: string;
} 
