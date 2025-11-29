import { IGetSecurityDataProps } from "@/actions/actor/general/security-data/getSecurities";
import { ISecuritiesNamesResponse, ISecuritiesResponse, ISecurity, ISecurityIdsResponse } from "@/types/actor/general/security-data/securitiesResponse.types";

 
export const fakeSecurities: ISecurity[] = [
    { id: 1, name: "Faisal Abuzakari", identity: "405100001", mobileNumber: "0599000001", rank: "SECURITY_OFFICER" },
    { id: 2, name: "آية رامي", identity: "405100002", mobileNumber: "0599000002", rank: "SECURITY_OFFICER" },
    { id: 3, name: "أحمد نبيل", identity: "405100003", mobileNumber: "0599000003", rank: "SECURITY_PERSON" },
    { id: 4, name: "سارة عيسى", identity: "405100004", mobileNumber: "0599000004", rank: "SECURITY_PERSON" },
    { id: 5, name: "جهاد عماد", identity: "405100005", mobileNumber: "0599000005", rank: "SECURITY_OFFICER" },
    { id: 6, name: "رهف حسين", identity: "405100006", mobileNumber: "0599000006", rank: "SECURITY_PERSON" },
    { id: 7, name: "باسل وائل", identity: "405100007", mobileNumber: "0599000007", rank: "SECURITY_PERSON" },
    { id: 8, name: "هناء فايز", identity: "405100008", mobileNumber: "0599000008", rank: "SECURITY_OFFICER" },
    { id: 9, name: "رامي يوسف", identity: "405100009", mobileNumber: "0599000009", rank: "SECURITY_PERSON" },
    { id: 10, name: "إيمان سامي", identity: "405100010", mobileNumber: "0599000010", rank: "SECURITY_PERSON" },
    { id: 11, name: "عبدالله صالح", identity: "405100011", mobileNumber: "0599000011", rank: "SECURITY_PERSON" },
    { id: 12, name: "منار خالد", identity: "405100012", mobileNumber: "0599000012", rank: "SECURITY_OFFICER" },
    { id: 13, name: "علي نضال", identity: "405100013", mobileNumber: "0599000013", rank: "SECURITY_PERSON" },
    { id: 14, name: "نوران علاء", identity: "405100014", mobileNumber: "0599000014", rank: "SECURITY_PERSON" },
    { id: 15, name: "خالد منصور", identity: "405100015", mobileNumber: "0599000015", rank: "SECURITY_OFFICER" },
    { id: 16, name: "ليلى أحمد", identity: "405100016", mobileNumber: "0599000016", rank: "SECURITY_PERSON" },
    { id: 17, name: "عصام فؤاد", identity: "405100017", mobileNumber: "0599000017", rank: "SECURITY_PERSON" },
    { id: 18, name: "ياسمين خالد", identity: "405100018", mobileNumber: "0599000018", rank: "SECURITY_OFFICER" },
    { id: 19, name: "محمود سامي", identity: "405100019", mobileNumber: "0599000019", rank: "SECURITY_PERSON" },
    { id: 20, name: "دعاء ناصر", identity: "405100020", mobileNumber: "0599000020", rank: "SECURITY_PERSON" },
    { id: 21, name: "وائل نادر", identity: "405100021", mobileNumber: "0599000021", rank: "SECURITY_OFFICER" },
    { id: 22, name: "نورا حسن", identity: "405100022", mobileNumber: "0599000022", rank: "SECURITY_PERSON" },
    { id: 23, name: "سامي عدنان", identity: "405100023", mobileNumber: "0599000023", rank: "SECURITY_PERSON" },
    { id: 24, name: "أروى خليل", identity: "405100024", mobileNumber: "0599000024", rank: "SECURITY_OFFICER" },
    { id: 25, name: "زياد حسين", identity: "405100025", mobileNumber: "0599000025", rank: "SECURITY_PERSON" },
];


export const fakeSecuritiesResponse = ({ page = 1, limit = 10 }: IGetSecurityDataProps): ISecuritiesResponse => {
    const paged = fakeSecurities.slice((page - 1) * limit, page * limit);
    return {
        status: 200,
        message: "تم جلب بيانات أفراد الأمن بنجاح",
        securities: paged,
        error: undefined,
        pagination: {
            page,
            limit,
            totalItems: fakeSecurities.length,
            totalPages: Math.ceil(fakeSecurities.length / limit)
        }
    };
};

export const fakeSecuritiesIdsResponse = (): ISecurityIdsResponse => {
    return {
        status: 200,
        message: "تم جلب معرفات أفراد الأمن بنجاح",
        securitiesIds: fakeSecurities.map((s) => s.id),
        error: undefined
    };
};


export const fakeSecuritiesNamesResponse = ({ ids }: { ids?: number[]; }): ISecuritiesNamesResponse => {
    const filtered = ids ? fakeSecurities.filter((s) => ids.includes(s.id)) : fakeSecurities;
    return {
        status: 200,
        message: "تم جلب أسماء أفراد الأمن بنجاح",
        securitiesNames: filtered.map((s) => ({ id: s.id, name: s.name })),
        error: undefined
    };
};

// // export const fakeSecuritiesByIdsResponse = ({ ids }: { ids: number[]; }): SecuritiesResponse => {
// //     const filtered = fakeSecurities.filter((s) => ids.includes(s.id));
// //     return {
// //         status: 200,
// //         message: "تم جلب بيانات أفراد الأمن بنجاح",
// //         securities: filtered,
 
// //     };
// // };
