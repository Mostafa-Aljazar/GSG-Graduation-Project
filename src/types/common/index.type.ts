import { BookOpenCheck, Gift, HandHeart, MicVocal, Newspaper } from "lucide-react";

export enum TYPE_WRITTEN_CONTENT {
    BLOG = 'BLOG',
    SUCCESS_STORIES = 'SUCCESS_STORIES',
    ADS = 'ADS',
}

export const getWrittenContentTabs = () => {
    return {
        ADS: { label: 'الإعلانات', icon: MicVocal },
        BLOG: { label: 'المدونة', icon: Newspaper },
        SUCCESS_STORIES: { label: 'قصص النجاح', icon: BookOpenCheck },
    } as const;
}



export enum ACTION_ADD_EDIT_DISPLAY {
    DISPLAY = "DISPLAY",
    ADD = 'ADD',
    EDIT = 'EDIT',
}


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
