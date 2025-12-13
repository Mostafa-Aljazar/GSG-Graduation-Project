import { SOCIAL_STATUS } from "../../common/index.type";
import { IBaseProfile } from "../../common/user/base-profile.type";
import { USER_RANK, USER_TYPE } from "@/constants/user-types";

// ----------------- DELEGATE -----------------
export interface IDelegateProfile extends IBaseProfile {
    role: USER_TYPE.DELEGATE;
    rank: USER_RANK.DELEGATE;
    age: number;
    socialStatus: SOCIAL_STATUS;
    education: string;
    numberOfResponsibleCamps?: number;
    numberOfFamilies?: number;
}

export interface IDelegateProfileResponse {
    status: number;
    message: string;
    user: IDelegateProfile;
    error?: string;
}
