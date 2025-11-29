import { TUserType, USER_TYPE } from "@/constants/user-types";
import { GENDER, SOCIAL_STATUS } from "@/types/common/actors-information.type";

export interface ManagerProfile {
    id?: number; //HINT: optional in create manager
    name: string
    email: string
    gender: GENDER
    profile_image?: string
    identity: string
    nationality: string;
    social_status: SOCIAL_STATUS
    phone_number: string
    alternative_phone_number?: string
    role: Exclude<
        TUserType,
        typeof USER_TYPE.DELEGATE | typeof USER_TYPE.DISPLACED>;
    rank: Exclude<
        TUserType,
         typeof USER_TYPE.DELEGATE | typeof USER_TYPE.DISPLACED>;
}

export interface ManagerProfileResponse {
    status: number;
    message?: string;
    user: ManagerProfile;
    error?: string;
}