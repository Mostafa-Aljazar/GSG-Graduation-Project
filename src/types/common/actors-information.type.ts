import {
    DollarSign,
    Utensils,
    HeartPulse,
    SprayCan,
    Shirt,
    BookOpen,
    Package,
    History,
    Activity,
    CalendarCheck, CalendarClock, CheckCircle2, Gift, HandHeart, MessageCircleQuestion, MessageSquareWarning,
    MicVocal,
    Newspaper,
    BookOpenCheck
} from "lucide-react";

/////////////////////////////////////////////////////////////////////////

export enum ACTION_ADD_EDIT_DISPLAY {
    DISPLAY = "DISPLAY",
    ADD = 'ADD',
    EDIT = 'EDIT',
}

/////////////////////////////////////////////////////////////////////////

export enum SOCIAL_STATUS {
    SINGLE = 'SINGLE',
    MARRIED = 'MARRIED',
    DIVORCED = 'DIVORCED',
    WIDOWED = 'WIDOWED'
}

export const SOCIAL_STATUS_LABELS: Record<SOCIAL_STATUS, string> = {
    [SOCIAL_STATUS.SINGLE]: 'أعزب / عزباء',
    [SOCIAL_STATUS.MARRIED]: 'متزوج / متزوجة',
    [SOCIAL_STATUS.DIVORCED]: 'مطلق / مطلقة',
    [SOCIAL_STATUS.WIDOWED]: 'أرمل / أرملة',
};

/////////////////////////////////////////////////////////////////////////

export enum GENDER {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export const GENDER_LABELS: Record<GENDER, string> = {
    [GENDER.MALE]: 'ذكر',
    [GENDER.FEMALE]: 'أنثى'
};

/////////////////////////////////////////////////////////////////////////

export enum WIFE_STATUS {
    PREGNANT = 'PREGNANT',
    WET_NURSE = 'WET_NURSE'
}

export const WIFE_STATUS_LABELS: Record<WIFE_STATUS, string> = {
    [WIFE_STATUS.PREGNANT]: 'حامل',
    [WIFE_STATUS.WET_NURSE]: 'مرضعة',
};

/////////////////////////////////////////////////////////////////////////

export enum AGES {
    LESS_THAN_6_MONTHS = 'LESS_THAN_6_MONTHS',
    FROM_6_MONTHS_TO_2_YEARS = 'FROM_6_MONTHS_TO_2_YEARS',
    FROM_2_YEARS_To_6_YEARS = 'FROM_2_YEARS_To_6_YEARS',
    FROM_6_YEARS_To_12_YEARS = 'FROM_6_YEARS_To_12_YEARS',
    FROM_12_YEARS_To_18_YEARS = 'FROM_12_YEARS_To_18_YEARS',
    MORE_THAN_18 = 'MORE_THAN_18'
}

export const AGES_LABELS: Record<AGES, string> = {
    [AGES.LESS_THAN_6_MONTHS]: 'أقل من 6 أشهر',
    [AGES.FROM_6_MONTHS_TO_2_YEARS]: 'من 6 أشهر إلى سنتين',
    [AGES.FROM_2_YEARS_To_6_YEARS]: 'من سنتين إلى 6 سنوات',
    [AGES.FROM_6_YEARS_To_12_YEARS]: 'من 6 سنوات إلى 12 سنة',
    [AGES.FROM_12_YEARS_To_18_YEARS]: 'من 12 سنة إلى 18 سنة',
    [AGES.MORE_THAN_18]: 'أكثر من 18 سنة',
};

/////////////////////////////////////////////////////////////////////////

export enum ACCOMMODATION_TYPE {
    INDOOR_TENT = 'INDOOR_TENT',
    INDOOR_BUILDING = 'INDOOR_BUILDING',
    OUTDOOR = 'OUTDOOR',
}

export const ACCOMMODATION_TYPE_LABELS: Record<ACCOMMODATION_TYPE, string> = {
    [ACCOMMODATION_TYPE.INDOOR_TENT]: 'خيمة - داخلية',
    [ACCOMMODATION_TYPE.INDOOR_BUILDING]: 'مبنى - داخلي',
    [ACCOMMODATION_TYPE.OUTDOOR]: 'خارجي',
};

/////////////////////////////////////////////////////////////////////////

export enum FAMILY_STATUS_TYPE {
    NORMAL = 'NORMAL',
    DIFFICULT = 'DIFFICULT',
    CRITICAL = 'CRITICAL',
}

export const FAMILY_STATUS_TYPE_LABELS: Record<FAMILY_STATUS_TYPE, string> = {
    [FAMILY_STATUS_TYPE.NORMAL]: 'عادي',
    [FAMILY_STATUS_TYPE.DIFFICULT]: 'صعب',
    [FAMILY_STATUS_TYPE.CRITICAL]: 'حرج',
};

/////////////////////////////////////////////////////////////////////////

export enum CHRONIC_DISEASE {
    false = 'false',
    true = 'true',
}

export const CHRONIC_DISEASE_LABELS: Record<CHRONIC_DISEASE, string> = {
    [CHRONIC_DISEASE.false]: 'لا يوجد',
    [CHRONIC_DISEASE.true]: 'يوجد',
};

/////////////////////////////////////////////////////////////////////////

// FIXME: reverse it
export enum DESTINATION_AID {
    // DISPLACEDS = 'DISPLACEDS',
    DISPLAY_AIDS = 'DISPLAY_AIDS',
    EDIT_AIDS = 'EDIT_AIDS',
    ADD_AIDS = 'ADD_AIDS',
}

/////////////////////////////////////////////////////////////////////////

export enum DISPLACED_RECEIVED_AIDS_TABS {
    RECEIVED_AIDS = 'RECEIVED_AIDS',
    PROVIDED_AIDS = 'PROVIDED_AIDS',
}

export const GET_DISPLACED_RECEIVED_AIDS_TABS = {
    [DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS]: {
        label: 'المساعدات المستلمة',
        icon: Gift, // ترمز لهدية أو شيء تم استلامه
    },
    [DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS]: {
        label: 'المساعدات المقدّمة',
        icon: HandHeart, // ترمز لفعل العطاء أو التقديم
    },
} as const;

/////////////////////////////////////////////////////////////////////////

export enum COMPLAINTS_TABS {
    SENT_COMPLAINTS = 'SENT_COMPLAINTS',
    RECEIVED_COMPLAINTS = 'RECEIVED_COMPLAINTS',
}

export const GET_COMPLAINTS_TABS = {
    [COMPLAINTS_TABS.SENT_COMPLAINTS]: {
        label: 'الشكاوي المرسلة',
        icon: MessageCircleQuestion,
    },
    [COMPLAINTS_TABS.RECEIVED_COMPLAINTS]: {
        label: 'الشكاوي المستقبلة',
        icon: MessageSquareWarning,
    },
} as const;

export enum COMPLAINTS_STATUS {
    READ = 'READ',
    PENDING = 'PENDING',
    ALL = "ALL"
}

export const COMPLAINTS_STATUS_LABELS: Record<COMPLAINTS_STATUS, string> = {
    [COMPLAINTS_STATUS.READ]: 'تمت القراءة',
    [COMPLAINTS_STATUS.PENDING]: 'قيد الانتظار',
    [COMPLAINTS_STATUS.ALL]: 'الكل',
};

/////////////////////////////////////////////////////////////////////////

// // Define the enum for tasks tabs
export enum TASKS_TABS {
    COMPLETED_TASKS = 'COMPLETED_TASKS',
    UPCOMING_TASKS = 'UPCOMING_TASKS',
}

// TASKS Tabs configuration
export const GET_TASKS_TABS = {
    [TASKS_TABS.COMPLETED_TASKS]: {
        label: 'مهام منجزة',
        icon: CheckCircle2,
    },
    [TASKS_TABS.UPCOMING_TASKS]: {
        label: 'مهام قادمة',
        icon: CalendarClock,
    },
} as const;


/////////////////////////////////////////////////////////////////////////


export enum TYPE_GROUP_AIDS {
    PREVIOUS_AIDS = 'PREVIOUS_AIDS',
    ONGOING_AIDS = 'ONGOING_AIDS',
    COMING_AIDS = 'COMING_AIDS',
}

export const GET_AIDS_MANAGEMENT_TABS = {
    PREVIOUS_AIDS: { label: 'السابقة', icon: History },
    ONGOING_AIDS: { label: 'الجارية', icon: Activity },
    COMING_AIDS: { label: 'القادمة', icon: CalendarCheck },
} as const;

export enum TYPE_AIDS {
    FINANCIAL_AID = "FINANCIAL_AID",
    FOOD_AID = "FOOD_AID",
    MEDICAL_AID = "MEDICAL_AID",
    CLEANING_AID = "CLEANING_AID",
    CLOTHING_AIDS = "CLOTHING_AIDS",
    EDUCATIONAL_AID = "EDUCATIONAL_AID",
    OTHER_AID = "OTHER_AID",
}

export const TYPE_AIDS_LABELS: Record<TYPE_AIDS, string> = {
    [TYPE_AIDS.FINANCIAL_AID]: 'مساعدة ماليّة',
    [TYPE_AIDS.FOOD_AID]: 'مساعدة غذائية',
    [TYPE_AIDS.MEDICAL_AID]: 'مساعدة صحية',
    [TYPE_AIDS.CLEANING_AID]: 'مساعدة تنظيفة',
    [TYPE_AIDS.CLOTHING_AIDS]: 'مساعدة ملابس',
    [TYPE_AIDS.EDUCATIONAL_AID]: 'مساعدة تعليمية',
    [TYPE_AIDS.OTHER_AID]: 'مساعدات أخرى',
};

export const GET_AIDS_TYPE_ICONS = {
    [TYPE_AIDS.FINANCIAL_AID]: DollarSign,
    [TYPE_AIDS.FOOD_AID]: Utensils,
    [TYPE_AIDS.MEDICAL_AID]: HeartPulse,
    [TYPE_AIDS.CLEANING_AID]: SprayCan,
    [TYPE_AIDS.CLOTHING_AIDS]: Shirt,
    [TYPE_AIDS.EDUCATIONAL_AID]: BookOpen,
    [TYPE_AIDS.OTHER_AID]: Package,
} as const;


// export const DEFAULT_CATEGORIES: CategoryRangeType[] = [
//     {
//         id: '1-3 أفراد',
//         label: '1-3 أفراد',
//         min: 1,
//         max: 3,
//         is_default: true,
//         portion: 1,
//     },
//     {
//         id: '4-6 أفراد',
//         label: '4-6 أفراد',
//         min: 4,
//         max: 6,
//         is_default: true,
//         portion: 2,
//     },
//     {
//         id: '7-9 أفراد',
//         label: '7-9 أفراد',
//         min: 7,
//         max: 9,
//         is_default: true,
//         portion: 3,
//     },
//     {
//         id: 'أكثر من 10 أفراد',
//         label: 'أكثر من 10 أفراد',
//         min: 10,
//         max: null,
//         is_default: true,
//         portion: 4,
//     },
// ];

export enum DISTRIBUTION_MECHANISM {
    DELEGATES_LISTS = "DELEGATES_LISTS",
    DISPLACED_FAMILIES = "DISPLACED_FAMILIES"
}

export enum DELEGATE_PORTIONS {
    EQUAL = 'EQUAL',
    MANUAL = 'MANUAL'
}

export enum QUANTITY_AVAILABILITY {
    LIMITED = 'LIMITED',
    UNLIMITED = 'UNLIMITED'
}

export enum DISTRIBUTION_METHOD {
    EQUAL = 'EQUAL',
    FAMILY_NUMBER = 'FAMILY_NUMBER'
}

/////////////////////////////////////////////////////////////////////////

export enum TYPE_WRITTEN_CONTENT {
    ADS = 'ADS',
    BLOG = 'BLOG',
    SUCCESS_STORIES = 'SUCCESS_STORIES',
}

export const GET_WRITTEN_CONTENT_TABS = {
    ADS: { label: 'الإعلانات', icon: MicVocal },
    BLOG: { label: 'المدونة', icon: Newspaper },
    SUCCESS_STORIES: { label: 'قصص النجاح', icon: BookOpenCheck },
} as const;

// export const TYPE_WRITTEN_CONTENT_LABELS: Record<TYPE_WRITTEN_CONTENT, string> = {
//     [TYPE_WRITTEN_CONTENT.ADS]: 'الإعلانات',
//     [TYPE_WRITTEN_CONTENT.BLOG]: 'المدونة',
//     [TYPE_WRITTEN_CONTENT.SUCCESS_STORIES]: 'قصص النجاح',
// };


// export const GET_WRITTEN_CONTENT_ICONS = {
//     [TYPE_WRITTEN_CONTENT.ADS]: MicVocal,
//     [TYPE_WRITTEN_CONTENT.BLOG]: Newspaper,
//     [TYPE_WRITTEN_CONTENT.SUCCESS_STORIES]: BookOpenCheck,

// } as const;


export const ADS_HEADER_TITLE = 'الإعلانات :';
export const BLOG_HEADER_TITLE = 'مدونتنا :';
export const SUCCESS_STORIES_HEADER_TITLE = 'قصص النجاح:';

/////////////////////////////////////////////////////////////////////////

export enum DELEGATE_DESTINATION_AID {
    ADD_DISPLACEDS_AID = 'ADD_DISPLACEDS_AID',
    DELIVERY_AID = 'DELIVERY_AID',
}


/////////////////////////////////////////////////////////////////////////

export enum MANAGER_DESTINATION_AID {
    AID = 'AID',
    ADD_AID = 'ADD_AID',
}
