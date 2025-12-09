import { USER_TYPE, USER_RANK } from "@/constants/user-types";
import { StaticImageData } from "next/image";

export interface IUser {
    id: string; // MongoDB ObjectId
    name: string;
    email: string;
    identity: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    profileImage?: string | StaticImageData | null;
    role: USER_TYPE;
    rank: USER_RANK;
}
