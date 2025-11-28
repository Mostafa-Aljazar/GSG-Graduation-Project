import { BookOpenCheck, MicVocal, Newspaper } from "lucide-react";

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