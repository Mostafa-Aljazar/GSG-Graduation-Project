import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { GENDER, SOCIAL_STATUS } from "@/types/actor/common/index.type";
import { IManagerProfile, IManagerProfileResponse } from "@/types/actor/manager/profile/manager-profile-response.type";

export const fakeManagerProfile: IManagerProfile = {
    id: "1",
    name: 'مصطفى يوسف',
    email: "alaqsa@gmail.com",
    gender: GENDER.MALE,
    profileImage: '',
    identity: '123456789',
    nationality: 'فلسطيني',
    mobileNumber: "0599999999",
    alternativeMobileNumber: "0597777777",
    socialStatus: SOCIAL_STATUS.MARRIED,
    rank: USER_RANK.MANAGER,
    role: USER_TYPE.MANAGER,
}

export const fakeManagerProfileResponse = ({ managerId }: { managerId: string }): IManagerProfileResponse => {

    const managerProfile: IManagerProfile = { ...fakeManagerProfile, id: managerId }

    if (!managerProfile) {
        return {
            status: 404,
            message: 'المدير غير موجود',
            user: {} as IManagerProfile,
            error: 'المدير غير موجود',
        };
    }

    return {
        status: 200,
        message: 'تم جلب بيانات الملف الشخصي بنجاح',
        user: managerProfile,
    };
};