import { IGetDelegatesProps } from "@/actions/actor/general/delegates/getDelegates";
import { IGetDelegatesByIdsProps } from "@/actions/actor/general/delegates/getDelegatesByIds";
import { IGetDelegatesNamesProps } from "@/actions/actor/general/delegates/getDelegatesNames";
import { IDelegate, IDelegatesIdsResponse, IDelegatesNamesResponse, IDelegatesResponse } from "@/types/actor/general/delegates/delegatesResponse.type";


export const fakeDelegates: IDelegate[] = [
    { id: -1, name: 'بدون مندوب', identity: '999999999', displacedNumber: 0, familyNumber: 0, mobileNumber: '0595000000', tentsNumber: 0 },
    { id: 1, name: "mostafa aljzar", identity: '408656429', displacedNumber: 50, familyNumber: 20, mobileNumber: '0595867456', tentsNumber: 10 },
    { id: 2, name: 'علي خالد بن عمر', identity: '960128156', displacedNumber: 60, familyNumber: 25, mobileNumber: '0595867457', tentsNumber: 12 },
    { id: 3, name: 'فاطمة زيد بنت حسن', identity: '960128157', displacedNumber: 45, familyNumber: 18, mobileNumber: '0595867458', tentsNumber: 8 },
    { id: 4, name: 'خالد يوسف بن سالم', identity: '960128158', displacedNumber: 55, familyNumber: 22, mobileNumber: '0595867459', tentsNumber: 11 },
    { id: 5, name: 'سارة ناصر بنت أحمد', identity: '960128159', displacedNumber: 48, familyNumber: 19, mobileNumber: '0595867460', tentsNumber: 9 },
    { id: 6, name: 'عمر زياد بن محمود', identity: '960128160', displacedNumber: 62, familyNumber: 26, mobileNumber: '0595867461', tentsNumber: 13 },
    { id: 7, name: 'ليلى صبري بنت رامي', identity: '960128161', displacedNumber: 53, familyNumber: 21, mobileNumber: '0595867462', tentsNumber: 10 },
    { id: 8, name: 'ياسر حمد بن عبدالله', identity: '960128162', displacedNumber: 57, familyNumber: 23, mobileNumber: '0595867463', tentsNumber: 11 },
];

export const fakeDelegatesResponse = ({ page = 1, limit = 10 }: IGetDelegatesProps): IDelegatesResponse => {

    const delegatesData = fakeDelegates

    if (!delegatesData) {
        return {
            status: 500,
            message: 'حدث خطأ أثناء جلب بيانات المناديب',
            error: 'حدث خطأ أثناء جلب بيانات المناديب',
            delegates: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
        };
    }

    return {
        status: 200,
        message: 'تم جلب بيانات المناديب بنجاح',
        delegates: delegatesData.slice((page - 1) * limit, page * limit),
        error: undefined,
        pagination: {
            page,
            limit,
            totalItems: delegatesData.length,
            totalPages: Math.ceil(delegatesData.length / limit),
        }
    }

};


export const fakeDelegatesByIdsResponse = ({
    Ids = [],
    page = 1,
    limit = 7,
}: IGetDelegatesByIdsProps): IDelegatesResponse => {
    const filteredDelegates = fakeDelegates.filter((delegate) =>
        Ids.includes(delegate.id)
    );

    return {
        status: 200,
        message: 'تم جلب بيانات المناديب بنجاح',
        delegates: filteredDelegates.slice((page - 1) * limit, page * limit),
        error: undefined,
        pagination: {
            page,
            limit,
            totalItems: filteredDelegates.length,
            totalPages: Math.ceil(filteredDelegates.length / limit),
        },
    };
};


export const fakeDelegatesIdsResponse = (): IDelegatesIdsResponse => {
    return {
        status: 200,
        message: 'تم جلب بيانات المناديب بنجاح',
        delegatesIds: fakeDelegates.map(delegate => delegate.id),
        error: undefined,
    }
};

export const fakeDelegatesNamesResponse = ({ ids }: IGetDelegatesNamesProps): IDelegatesNamesResponse => {
    const filtered = ids ? fakeDelegates.filter((s) => ids.includes(s.id)) : fakeDelegates;
    return {
        status: 200,
        message: "تم جلب أسماء المناديب بنجاح",
        delegateNames: filtered.map((s) => ({ id: s.id, name: s.name })),
        error: undefined
    };
};

