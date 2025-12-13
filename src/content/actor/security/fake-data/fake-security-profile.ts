import { GENDER, SOCIAL_STATUS } from "@/types/actor/common/index.type";
import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { ISecurityProfile, ISecurityProfileResponse } from "@/types/actor/security/profile/security-profile-response.type";
import { IGetSecurityProfileProps } from "@/actions/actor/securities/profile/getSecurityProfile";

export const fakeSecurityProfiles: ISecurityProfile[] = [
    {
        id: "1",
        profileImage: undefined,
        name: "فؤاد الحسن",
        email: "fouad@example.com",
        identity: "405100101",
        nationality: "سوري",
        gender: GENDER.MALE,
        mobileNumber: "+970599000001",
        alternativeMobileNumber: undefined,
        role: USER_TYPE.SECURITY_PERSON,
        rank: USER_RANK.SECURITY_OFFICER,
        socialStatus: SOCIAL_STATUS.MARRIED,
        additionalNotes: "لا ملاحظات",
    },
    {
        id: "2",
        profileImage: undefined,
        name: "آية علي",
        email: "aya@example.com",
        identity: "405100102",
        nationality: "سورية",
        gender: GENDER.FEMALE,
        mobileNumber: "+970599000002",
        alternativeMobileNumber: "+970599000099",
        role: USER_TYPE.SECURITY_PERSON,
        rank: USER_RANK.SECURITY_PERSON,
        socialStatus: SOCIAL_STATUS.SINGLE,
        additionalNotes: "خبرة سنتين",
    },
];

export const fakeSecurityProfileResponse = ({
    securityId,
}: IGetSecurityProfileProps): ISecurityProfileResponse => {
    const profile = fakeSecurityProfiles.find((p) => p.id === securityId);

    if (!profile) {
        return {
            status: 404,
            message: "فرد الأمن غير موجود",
            user: {
                id: securityId,
                profileImage: undefined,
                name: "",
                email: "",
                identity: "",
                nationality: "",
                gender: GENDER.MALE,
                mobileNumber: "",
                alternativeMobileNumber: undefined,
                role: USER_TYPE.SECURITY_PERSON,
                rank: USER_RANK.SECURITY_PERSON,
                socialStatus: SOCIAL_STATUS.SINGLE,
                additionalNotes: undefined,
            },
            error: "فرد الأمن غير موجود",
        };
    }

    return {
        status: 200,
        message: "تم جلب بيانات فرد الأمن بنجاح",
        user: profile,
        error: undefined,
    };
};
