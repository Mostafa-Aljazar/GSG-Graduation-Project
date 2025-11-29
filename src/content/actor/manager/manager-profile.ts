import { USER_TYPE } from "@/constants/user-types";
import { GENDER, SOCIAL_STATUS } from "@/types/common/actors-information.type";
import { ManagerProfile, ManagerProfileResponse } from "@/types/manager/profile/manager-profile-response.type";

export const fakeManagerProfile: ManagerProfile = {
    id: 1,
    name: 'مصطفى يوسف',
    email: "alaqsa@gmail.com",
    gender: GENDER.MALE,
    profile_image: '',
    identity: '123456789',
    nationality: 'فلسطيني',
    phone_number: "0599999999",
    alternative_phone_number: "0597777777",
    social_status: SOCIAL_STATUS.MARRIED,
    rank: USER_TYPE.MANAGER,
    role: USER_TYPE.MANAGER,
}

export const fakeManagerProfileResponse = ({ manager_Id }: { manager_Id: number }): ManagerProfileResponse => {

    const managerProfile: ManagerProfile = { ...fakeManagerProfile, id: manager_Id }

    if (!managerProfile) {
        return {
            status: 404,
            message: 'المدير غير موجود',
            user: {} as ManagerProfile,
            error: 'المدير غير موجود',
        };
    }

    return {
        status: 200,
        message: 'تم جلب بيانات الملف الشخصي بنجاح',
        user: managerProfile,
    };
};