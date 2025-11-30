import { CalendarClock, CheckCircle2 } from "lucide-react";


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


