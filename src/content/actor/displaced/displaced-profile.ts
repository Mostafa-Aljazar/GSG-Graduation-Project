import { USER_TYPE } from "@/constants/user-types";
import { ACCOMMODATION_TYPE, AGES, FAMILY_STATUS_TYPE, GENDER, SOCIAL_STATUS } from "@/types/common/actors-information.type";
import { DisplacedProfile, DisplacedProfileResponse } from "@/types/displaced/profile/displaced-profile.type";



export const fakeDisplacedProfile: DisplacedProfile = {
    id: 1,
    email: "ameerabudraze@gmail.com",
    name: "ameer abu draze",
    gender: GENDER.MALE,
    profile_image: '',
    identity: '960128163',
    nationality: 'فلسطيني',
    original_address: 'غزة - الشجاعية',
    phone_number: "0599999999",
    alternative_phone_number: "0597777777",

    wives: [
        {
            name: 'هبة سعيد',
            identity: '987654321',
            nationality: 'فلسطيني',
            is_pregnant: true,
            is_wet_nurse: false,
        },
        {
            name: 'رنا يوسف',
            identity: '456789123',
            nationality: 'فلسطيني',
            is_pregnant: false,
            is_wet_nurse: true,
        },
    ],

    social_status: {
        status: SOCIAL_STATUS.MARRIED,
        number_of_wives: 2,
        number_of_males: 4,
        number_of_females: 3,
        total_family_members: 9,
        age_groups: {
            [AGES.LESS_THAN_6_MONTHS]: 1,
            [AGES.FROM_6_MONTHS_TO_2_YEARS]: 1,
            [AGES.FROM_2_YEARS_To_6_YEARS]: 2,
            [AGES.FROM_6_YEARS_To_12_YEARS]: 1,
            [AGES.FROM_12_YEARS_To_18_YEARS]: 2,
            [AGES.MORE_THAN_18]: 2,
        },
    },

    displacement: {
        tent_number: 'خيمة-113',
        tent_type: ACCOMMODATION_TYPE.INDOOR_TENT,
        family_status_type: FAMILY_STATUS_TYPE.DIFFICULT,
        displacement_date: '2023-10-01',
        delegate: {
            id: "1", name: "mostafa aljzar"
        },

    },

    war_injuries: [
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

    medical_conditions: [
        {
            name: 'هبة سعيد',
            condition: 'ضغط الدم',
        },
        {
            name: 'رنا يوسف',
            condition: 'سكري',
        },
    ],
    rank: USER_TYPE.DISPLACED,
    role: USER_TYPE.DISPLACED,
    additional_notes: 'العائلة بحاجة إلى حليب أطفال وأدوية مزمنة.',
}

export const fakeDisplacedProfileResponse = ({ displaced_Id }: { displaced_Id: number }): DisplacedProfileResponse => {

    const displacedProfile = fakeDisplacedProfile

    if (!displacedProfile) {
        return {
            status: 404,
            message: 'النازح غير موجود',
            user: {} as DisplacedProfile,
            error: 'Delegate not found',
        };
    }

    return {
        status: 200,
        message: 'تم جلب بيانات الملف الشخصي بنجاح',
        user: displacedProfile,
        error: undefined,
    };
};