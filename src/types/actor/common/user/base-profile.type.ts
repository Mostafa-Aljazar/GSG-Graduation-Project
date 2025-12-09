import { StaticImageData } from "next/image";
import { USER_TYPE, USER_RANK } from "@/constants/user-types";
import { GENDER } from "../../common/index.type";

// ----------------- BASE PROFILE -----------------
export interface IBaseProfile {
    id?: string; // MongoDB ObjectId
    name: string;
    email: string;
    identity: string;
    nationality: string;
    gender: GENDER;
    profileImage?: string | StaticImageData | null;
    mobileNumber: string;
    alternativeMobileNumber?: string;
    role: USER_TYPE;
    rank: USER_RANK;
}

