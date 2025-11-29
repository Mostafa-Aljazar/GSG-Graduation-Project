import { getDelegatesByIdsProps } from '@/actions/actors/delegates/general/get-delegate-by-id';
import { getDelegatesProps } from '@/actions/actors/delegates/general/get-delegates';
import {
  Delegate,
  DelegatesIdsResponse,
  DelegatesNamesResponse,
  DelegatesResponse,
} from '@/types/delegate/general/delegate-response.type';

export const fakeDelegates: Delegate[] = [
  {
    id: -1,
    name: 'بدون مندوب',
    identity: '999999999',
    displaced_number: 0,
    family_number: 0,
    mobile_number: '0595000000',
    tents_number: 0,
  },
  {
    id: 1,
    name: 'mostafa aljzar',
    identity: '408656429',
    displaced_number: 50,
    family_number: 20,
    mobile_number: '0595867456',
    tents_number: 10,
  },
  {
    id: 2,
    name: 'علي خالد بن عمر',
    identity: '960128156',
    displaced_number: 60,
    family_number: 25,
    mobile_number: '0595867457',
    tents_number: 12,
  },
  {
    id: 3,
    name: 'فاطمة زيد بنت حسن',
    identity: '960128157',
    displaced_number: 45,
    family_number: 18,
    mobile_number: '0595867458',
    tents_number: 8,
  },
  {
    id: 4,
    name: 'خالد يوسف بن سالم',
    identity: '960128158',
    displaced_number: 55,
    family_number: 22,
    mobile_number: '0595867459',
    tents_number: 11,
  },
  {
    id: 5,
    name: 'سارة ناصر بنت أحمد',
    identity: '960128159',
    displaced_number: 48,
    family_number: 19,
    mobile_number: '0595867460',
    tents_number: 9,
  },
  {
    id: 6,
    name: 'عمر زياد بن محمود',
    identity: '960128160',
    displaced_number: 62,
    family_number: 26,
    mobile_number: '0595867461',
    tents_number: 13,
  },
  {
    id: 7,
    name: 'ليلى صبري بنت رامي',
    identity: '960128161',
    displaced_number: 53,
    family_number: 21,
    mobile_number: '0595867462',
    tents_number: 10,
  },
  {
    id: 8,
    name: 'ياسر حمد بن عبدالله',
    identity: '960128162',
    displaced_number: 57,
    family_number: 23,
    mobile_number: '0595867463',
    tents_number: 11,
  },
];

export const fakeDelegatesResponse = ({
  page = 1,
  limit = 10,
}: getDelegatesProps): DelegatesResponse => {
  const delegatesData = fakeDelegates;

  if (!delegatesData) {
    return {
      status: 500,
      message: 'حدث خطأ أثناء جلب بيانات المناديب',
      error: 'حدث خطأ أثناء جلب بيانات المناديب',
      delegates: [],
      pagination: { page: 1, limit: 0, total_items: 0, total_pages: 0 },
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
      total_items: delegatesData.length,
      total_pages: Math.ceil(delegatesData.length / limit),
    },
  };
};

export const fakeDelegatesIdsResponse = (): DelegatesIdsResponse => {
  return {
    status: 200,
    message: 'تم جلب بيانات المناديب بنجاح',
    delegates_Ids: fakeDelegates.map((delegate) => delegate.id),
    error: undefined,
  };
};

export const fakeDelegatesNamesResponse = ({ ids }: { ids?: number[] }): DelegatesNamesResponse => {
  const filtered = ids ? fakeDelegates.filter((s) => ids.includes(s.id)) : fakeDelegates;
  return {
    status: 200,
    message: 'تم جلب أسماء المناديب بنجاح',
    delegate_names: filtered.map((s) => ({ id: s.id, name: s.name })),
    error: undefined,
  };
};

export const fakeDelegatesByIdsResponse = ({
  Ids = [],
  page = 1,
  limit = 7,
}: getDelegatesByIdsProps): DelegatesResponse => {
  const filteredDelegates = fakeDelegates.filter((delegate) => Ids.includes(delegate.id));

  return {
    status: 200,
    message: 'تم جلب بيانات المناديب بنجاح',
    delegates: filteredDelegates.slice((page - 1) * limit, page * limit),
    error: undefined,
    pagination: {
      page,
      limit,
      total_items: filteredDelegates.length,
      total_pages: Math.ceil(filteredDelegates.length / limit),
    },
  };
};
