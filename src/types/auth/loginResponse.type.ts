import { IUser } from '../actor/common/user/user.type';

export interface ILoginResponse {
    status: number;
    message?: string;
    token: string;
    user: IUser;
    error?: string;
}

