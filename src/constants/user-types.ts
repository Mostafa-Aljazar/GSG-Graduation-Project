// constants/user-types.ts
export enum USER_TYPE {
    DISPLACED = 'DISPLACED',
    DELEGATE = 'DELEGATE',
    MANAGER = 'MANAGER',
    SECURITY_PERSON = 'SECURITY_PERSON',
}

export type TUserType = keyof typeof USER_TYPE;

export enum USER_RANK {
    DISPLACED = 'DISPLACED',
    DELEGATE = 'DELEGATE',
    MANAGER = 'MANAGER',
    SECURITY_PERSON = 'SECURITY_PERSON',
    SECURITY_OFFICER = 'SECURITY_OFFICER',
}

export type TUserRank = keyof typeof USER_RANK;

export const USER_RANK_LABELS: Record<USER_RANK, string> = {
    [USER_RANK.DISPLACED]: 'نازح',
    [USER_RANK.DELEGATE]: 'مندوب',
    [USER_RANK.MANAGER]: 'مدير',
    [USER_RANK.SECURITY_PERSON]: 'فرد الأمن',
    [USER_RANK.SECURITY_OFFICER]: 'مسؤول الأمن',
};
export const USER_ENDPOINTS: Record<USER_TYPE, string> = {
    [USER_TYPE.DISPLACED]: "/actor/displaceds",
    [USER_TYPE.DELEGATE]: "/actor/delegates",
    [USER_TYPE.MANAGER]: "/actor/managers",
    [USER_TYPE.SECURITY_PERSON]: "/actor/securities",
};