import { Activity, BookOpen, CalendarCheck, CalendarClock, CheckCircle2, DollarSign, Gift, HandHeart, HeartPulse, History, MessageCircleQuestion, MessageSquareWarning, Package, Shirt, SprayCan, Utensils } from "lucide-react";
import { IBaseAidForm, ICategoryRange } from "./aids-management/aids-management.types";


export const REACT_QUERY_KEYS = {
    WRITTEN_CONTENT_TAB: 'written-tab',
} as const;


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

//  Define the enum for tasks tabs
export enum TASKS_TABS {
    COMPLETED_TASKS = 'COMPLETED_TASKS',
    UPCOMING_TASKS = 'UPCOMING_TASKS',
}

export const getTasksTabs = () => {
    return {
        [TASKS_TABS.COMPLETED_TASKS]: { label: 'مهام منجزة', icon: CheckCircle2 },
        [TASKS_TABS.UPCOMING_TASKS]: { label: 'مهام قادمة', icon: CalendarClock, }
    } as const;
}


/////////////////////////////////////////////////////////////////////////

export enum DISPLACED_RECEIVED_AIDS_TABS {
    RECEIVED_AIDS = 'RECEIVED_AIDS',
    PROVIDED_AIDS = 'PROVIDED_AIDS',
}

export const getDisplacedReceivedAidsTabs = () => {
    return {
        [DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS]: { label: 'المساعدات المستلمة', icon: Gift },
        [DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS]: { label: 'المساعدات المقدّمة', icon: HandHeart }
    } as const;
}


/////////////////////////////////////////////////////////////////////////


export enum TYPE_GROUP_AIDS {
    PREVIOUS_AIDS = 'PREVIOUS_AIDS',
    ONGOING_AIDS = 'ONGOING_AIDS',
    COMING_AIDS = 'COMING_AIDS',
}


export const getAidsManagementTabs = () => {
    return {
        PREVIOUS_AIDS: { label: 'السابقة', icon: History },
        ONGOING_AIDS: { label: 'الجارية', icon: Activity },
        COMING_AIDS: { label: 'القادمة', icon: CalendarCheck },
    } as const;
}
/////////////////////////////////////////////////////////////////////////


export enum TYPE_AIDS {
    FINANCIAL_AID = "FINANCIAL_AID",
    FOOD_AID = "FOOD_AID",
    MEDICAL_AID = "MEDICAL_AID",
    CLEANING_AID = "CLEANING_AID",
    CLOTHING_AIDS = "CLOTHING_AIDS",
    EDUCATIONAL_AID = "EDUCATIONAL_AID",
    OTHER_AID = "OTHER_AID",
}


export const getAidsTypes = () => {
    return {
        [TYPE_AIDS.FINANCIAL_AID]: { label: 'مساعدة ماليّة', icon: DollarSign },
        [TYPE_AIDS.FOOD_AID]: { label: 'مساعدة غذائية', icon: Utensils },
        [TYPE_AIDS.MEDICAL_AID]: { label: 'مساعدة صحية', icon: HeartPulse },
        [TYPE_AIDS.CLEANING_AID]: { label: 'مساعدة تنظيفة', icon: SprayCan },
        [TYPE_AIDS.CLOTHING_AIDS]: { label: 'مساعدة ملابس', icon: Shirt },
        [TYPE_AIDS.EDUCATIONAL_AID]: { label: 'مساعدة تعليمية', icon: BookOpen },
        [TYPE_AIDS.OTHER_AID]: { label: 'مساعدات أخرى', icon: Package },
    } as const;
}


// FIXME: add to content
export const DEFAULT_CATEGORIES: ICategoryRange[] = [
    {
        id: 'الكل',
        label: 'الكل',
        min: 1,
        max: null,
        isDefault: true,
        portion: 1,
    },
    {
        id: '1-3 أفراد',
        label: '1-3 أفراد',
        min: 1,
        max: 3,
        isDefault: true,
        portion: 1,
    },
    {
        id: '4-6 أفراد',
        label: '4-6 أفراد',
        min: 4,
        max: 6,
        isDefault: true,
        portion: 2,
    },
    {
        id: '7-9 أفراد',
        label: '7-9 أفراد',
        min: 7,
        max: 9,
        isDefault: true,
        portion: 3,
    },
    {
        id: 'أكثر من 10 أفراد',
        label: 'أكثر من 10 أفراد',
        min: 10,
        max: null,
        isDefault: true,
        portion: 4,
    },
];

export enum DISTRIBUTION_MECHANISM {
    DELEGATES_LISTS = "DELEGATES_LISTS",
    DISPLACED_FAMILIES = "DISPLACED_FAMILIES",
}

export enum DELEGATE_PORTIONS {
    EQUAL = "EQUAL",
    MANUAL = "MANUAL",
}

export enum QUANTITY_AVAILABILITY {
    LIMITED = "LIMITED",
    UNLIMITED = "UNLIMITED",
}

export const AIDS_TYPES_MAP = {
    [TYPE_AIDS.FINANCIAL_AID]: { label: 'مساعدة ماليّة', icon: Package },
    [TYPE_AIDS.FOOD_AID]: { label: 'مساعدة غذائية', icon: Package },
    [TYPE_AIDS.MEDICAL_AID]: { label: 'مساعدة صحية', icon: Package },
    [TYPE_AIDS.CLEANING_AID]: { label: 'مساعدة تنظيفة', icon: Package },
    [TYPE_AIDS.CLOTHING_AIDS]: { label: 'مساعدة ملابس', icon: Package },
    [TYPE_AIDS.EDUCATIONAL_AID]: { label: 'مساعدة تعليمية', icon: Package },
    [TYPE_AIDS.OTHER_AID]: { label: 'مساعدات أخرى', icon: Package },
};

export const INITIAL_AID_FORM_VALUES: IBaseAidForm = {
    aidName: '',
    aidType: TYPE_AIDS.OTHER_AID,
    aidContent: '',
    deliveryDate: null,
    deliveryLocation: '',
    securityRequired: false,
    quantityAvailability: QUANTITY_AVAILABILITY.UNLIMITED,
    selectedCategories: [],
    additionalNotes: '',
    distributionMechanism: DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES,
    existingQuantity: undefined,
};



/////////////////////////////////////////////////////////////////////////





export enum COMPLAINTS_TABS {
    SENT_COMPLAINTS = 'SENT_COMPLAINTS',
    RECEIVED_COMPLAINTS = 'RECEIVED_COMPLAINTS',
}

// export const GET_COMPLAINTS_TABS = {
//     [COMPLAINTS_TABS.SENT_COMPLAINTS]: {
//         label: 'الشكاوي المرسلة',
//         icon: MessageCircleQuestion,
//     },
//     [COMPLAINTS_TABS.RECEIVED_COMPLAINTS]: {
//         label: 'الشكاوي المستقبلة',
//         icon: MessageSquareWarning,
//     },
// } as const;


export const getComplaintsTabs = () => {
    return {
        [COMPLAINTS_TABS.SENT_COMPLAINTS]: { label: 'الشكاوي المرسلة', icon: MessageCircleQuestion, },
        [COMPLAINTS_TABS.RECEIVED_COMPLAINTS]: { label: 'الشكاوي المستقبلة', icon: MessageSquareWarning, },
    } as const;
}


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