import { TUserRank, TUserType } from '@/constants/user-types';
import { StaticImageData } from 'next/image';

export interface IUser {
    id: number;
    name: string;
    email: string;
    identity: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    profileImage?: string | StaticImageData | null;
    role: TUserType; // used for auth-based routing
    rank?: TUserRank; // used for permission/access levels
}

export interface ILoginResponse {
    status: number;
    message?: string;
    token: string;
    user: IUser;
    error?: string;
}
