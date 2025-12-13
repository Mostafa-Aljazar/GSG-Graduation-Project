import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { ACCOMMODATION_TYPE, AGES, FAMILY_STATUS_TYPE, GENDER, SOCIAL_STATUS } from "@/types/actor/common/index.type";
import { IDisplacedProfile, IDisplacedProfileResponse } from "@/types/actor/displaceds/profile/displaced-profile.type";

export const fakeDisplacedProfile: IDisplacedProfile = {
    id: "1",
    email: "ameerabudraze@gmail.com",
    name: "Ameer Abu Draze",
    gender: GENDER.MALE,
    profileImage: '',
    identity: '960128163',
    nationality: 'فلسطيني',
    originalAddress: 'غزة - الشجاعية',
    mobileNumber: "0599999999",
    alternativeMobileNumber: "0597777777",

    wives: [
        {
            name: 'هبة سعيد',
            identity: '987654321',
            nationality: 'فلسطيني',
            isPregnant: true,
            isWetNurse: false,
        },
        {
            name: 'رنا يوسف',
            identity: '456789123',
            nationality: 'فلسطيني',
            isPregnant: false,
            isWetNurse: true,
        },
    ],

    socialStatus: {
        status: SOCIAL_STATUS.MARRIED,
        numberOfWives: 2,
        numberOfMales: 4,
        numberOfFemales: 3,
        totalFamilyMembers: 9,
        ageGroups: {
            [AGES.LESS_THAN_6_MONTHS]: 1,
            [AGES.FROM_6_MONTHS_TO_2_YEARS]: 1,
            [AGES.FROM_2_YEARS_To_6_YEARS]: 2,
            [AGES.FROM_6_YEARS_To_12_YEARS]: 1,
            [AGES.FROM_12_YEARS_To_18_YEARS]: 2,
            [AGES.MORE_THAN_18]: 2,
        },
    },

    displacement: {
        tentNumber: 'خيمة-113',
        tentType: ACCOMMODATION_TYPE.INDOOR_TENT,
        familyStatusType: FAMILY_STATUS_TYPE.DIFFICULT,
        displacementDate: '2023-10-01',
        delegate: {
            id: "1",
            name: "Mostafa Aljzar",
        },
    },

    warInjuries: [
        {
            name: 'سعيد يوسف',
            injury: 'إصابة في اليد اليسرى',
        },
    ],

    martyrs: [
        {
            name: 'ياسر يوسف',
        },
    ],

    medicalConditions: [
        {
            name: 'هبة سعيد',
            condition: 'ضغط الدم',
        },
        {
            name: 'رنا يوسف',
            condition: 'سكري',
        },
    ],

    rank: USER_RANK.DISPLACED,
    role: USER_TYPE.DISPLACED,
    additionalNotes: 'العائلة بحاجة إلى حليب أطفال وأدوية مزمنة.',
};

export const fakeDisplacedProfileResponse = ({
    displacedId,
}: {
    displacedId: string;
}): IDisplacedProfileResponse => {
    const displacedProfile = fakeDisplacedProfile;

    if (!displacedProfile) {
        return {
            status: 404,
            message: 'النازح غير موجود',
            user: {} as IDisplacedProfile,
            error: 'Displaced profile not found',
        };
    }

    return {
        status: 200,
        message: 'تم جلب بيانات الملف الشخصي بنجاح',
        user: displacedProfile,
        error: undefined,
    };
};
