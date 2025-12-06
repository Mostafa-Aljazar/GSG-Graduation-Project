import { GENDER, SOCIAL_STATUS } from "@/types/actor/common/index.type";
import { StaticImageData } from "next/image";


export interface IDelegateProfile {
    id?: number; //HINT: optional in create delegate
    name: string;
    profileImage: null | string | StaticImageData;
    gender: GENDER;
    socialStatus: SOCIAL_STATUS;
    identity: string;
    nationality: string;
    email: string;
    age: number;
    education: string;
    mobileNumber: string;
    alternativeMobileNumber?: string;
    numberOfResponsibleCamps?: number; // Read-only, from backend
    numberOfFamilies?: number; // Read-only, from backend
    // responsibleCampGroup: string; // Removed
}

export interface IDelegateProfileResponse {
    status: number;
    message?: string;
    user: IDelegateProfile;
    error?: string;
}