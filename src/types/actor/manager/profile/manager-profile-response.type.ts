import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { SOCIAL_STATUS } from "../../common/index.type";
import { IBaseProfile } from "../../common/user/base-profile.type";


// ----------------- MANAGER -----------------
export interface IManagerProfile extends IBaseProfile {
    role: USER_TYPE.MANAGER;
    rank: USER_RANK.MANAGER;
    socialStatus: SOCIAL_STATUS;
}

export interface IManagerProfileResponse {
    status: number;
    message: string;
    user: IManagerProfile;
    error?: string;
}

