import { MessageCircleQuestion, MessageSquareWarning } from 'lucide-react';


export const REACT_QUERY_KEYS = {
    WRITTEN_CONTENT_TAB: 'written-tab',
} as const;

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