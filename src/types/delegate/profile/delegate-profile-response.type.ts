import { GENDER, SOCIAL_STATUS } from "@/types/common/actors-information.type";
import { StaticImageData } from "next/image";

export interface DelegateProfileResponse {
    status: number;
    message?: string;
    user: DelegateProfile;
    error?: string;
}

export interface DelegateProfile {
    id?: number; //HINT: optional in create delegate
    name: string;
    profile_image: null | string | StaticImageData;
    gender: GENDER;
    social_status: SOCIAL_STATUS;
    identity: string;
    nationality: string;
    email: string;
    age: number;
    education: string;
    phone_number: string;
    alternative_phone_number?: string;
    number_of_responsible_camps?: number; // Read-only, from backend
    number_of_families?: number; // Read-only, from backend
    // responsibleCampGroup: string; // Removed
}