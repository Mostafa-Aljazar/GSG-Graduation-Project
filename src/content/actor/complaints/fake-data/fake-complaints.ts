import { IComplaint, IComplaintsResponse } from '@/types/actor/general/complaints/complaints-response.type';
import { USER_RANK, USER_TYPE } from '@/constants/user-types';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { IGetComplaintsProps } from '@/actions/actor/general/complaints/getComplaints';



export const fakeComplaints: IComplaint[] = [
    // 1. Displaced → Delegate
    {
        id: 1,
        date: '2024-10-20',
        sender: { id: 1, name: 'Ameer Abu Draze', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Mostafa Aljzar', image: '', role: USER_TYPE.DELEGATE },
        title: 'مشكلة في الإيواء',
        body: 'الخيمة غير صالحة للسكن.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 2. Displaced → Manager
    {
        id: 2,
        date: '2024-10-20',
        sender: { id: 1, name: 'Hala Khalil', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'انقطاع المياه',
        body: 'هناك انقطاع مستمر في المياه.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم تحويل الموضوع للجهة المختصة.',
    },

    // 3. Displaced → Security Person
    {
        id: 3,
        date: '2024-10-19',
        sender: { id: 1, name: 'Samer Jaber', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'إزعاج ليلي',
        body: 'هناك ضوضاء مستمرة قرب نقطة الأمن.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 4. Delegate → Manager
    {
        id: 4,
        date: '2024-10-18',
        sender: { id: 1, name: 'Ahmed Jihad', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'تأخير في المستلزمات',
        body: 'تم تأخير المواد لأكثر من أسبوع.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم التواصل مع قسم اللوجستيات.',
    },

    // 5. Delegate → Security Person
    {
        id: 5,
        date: '2024-10-18',
        sender: { id: 1, name: 'Ahmed Jihad', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'مشكلة في التنظيم',
        body: 'الطابور غير منظم ويحدث ازدحام.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 6. Security Person → Manager
    {
        id: 6,
        date: '2024-10-17',
        sender: { id: 1, name: 'Hussein Nemer', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'نقص معدات',
        body: 'لا توجد معدات كافية للنقطة.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم توفير المعدات قريباً.',
    },

    // 7. Security Person → Security Officer
    {
        id: 7,
        date: '2024-10-16',
        sender: { id: 1, name: 'Hussein Nemer', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Majed Omar', image: '', role: USER_RANK.SECURITY_OFFICER },
        title: 'سوء تفاهم',
        body: 'حدث خلاف أثناء التفتيش.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 8. Displaced → Manager
    {
        id: 8,
        date: '2024-10-15',
        sender: { id: 1, name: 'Samah Nabil', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'عدم توفر كهرباء',
        body: 'الكهرباء تنقطع كل ليلة.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم مراجعة فريق الصيانة.',
    },

    // 9. Displaced → Security Person
    {
        id: 9,
        date: '2024-10-14',
        sender: { id: 1, name: 'Laila Jihad', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'مشكلة لوجستية',
        body: 'المواد لم تصل في الوقت المناسب.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 10. Delegate → Manager
    {
        id: 10,
        date: '2024-10-14',
        sender: { id: 1, name: 'Eyad Nasser', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'سوء تفاهم',
        body: 'حدث سوء فهم أثناء توزيع المعونات.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم حل سوء الفهم.',
    },

    // 11. Displaced → Manager
    {
        id: 11,
        date: '2024-10-13',
        sender: { id: 1, name: 'Salim Imad', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'طلب نقل',
        body: 'أرغب بنقل خيمتي لمكان آخر.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 12. Security Person → Security Officer
    {
        id: 12,
        date: '2024-10-12',
        sender: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Majed Omar', image: '', role: USER_RANK.SECURITY_OFFICER },
        title: 'ضغط عمل',
        body: 'النقطة تعاني من نقص أفراد.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم توزيع أفراد إضافيين.',
    },

    // 13. Delegate → Security Person
    {
        id: 13,
        date: '2024-10-12',
        sender: { id: 1, name: 'Rania Aref', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'مشاكل في الدور',
        body: 'المستفيدون لا يلتزمون بالدور.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 14. Displaced → Delegate
    {
        id: 14,
        date: '2024-10-11',
        sender: { id: 1, name: 'Abdulrahman Salem', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Mostafa Aljzar', image: '', role: USER_TYPE.DELEGATE },
        title: 'نقص بطانيات',
        body: 'لا توجد بطانيات كافية.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 15. Displaced → Manager
    {
        id: 15,
        date: '2024-10-11',
        sender: { id: 1, name: 'Aya Adel', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'ازدحام شديد',
        body: 'المنطقة مزدحمة جداً.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم إعادة تنظيم المنطقة.',
    },

    // 16. Delegate → Security Person
    {
        id: 16,
        date: '2024-10-10',
        sender: { id: 1, name: 'Osama Rami', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'خلاف مع المستفيدين',
        body: 'بعض المستفيدين غير متعاونين.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 17. Security Person → Manager
    {
        id: 17,
        date: '2024-10-10',
        sender: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'نقص معدات السلامة',
        body: 'لا توجد سترات واقية كافية.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم تقديم طلب معدات جديدة.',
    },

    // 18. Displaced → Security Person
    {
        id: 18,
        date: '2024-10-09',
        sender: { id: 1, name: 'Maher Sulieman', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'مشاكل في التفتيش',
        body: 'التفتيش يستغرق وقتاً طويلاً.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 19. Displaced → Manager
    {
        id: 19,
        date: '2024-10-09',
        sender: { id: 1, name: 'Nour Ahmad', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'طلب دعم إضافي',
        body: 'هناك نقص في الطعام.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم إرسال مواد إضافية.',
    },

    // 20. Delegate → Security Person
    {
        id: 20,
        date: '2024-10-08',
        sender: { id: 1, name: 'Ola Samer', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'تأخير في فتح البوابة',
        body: 'البوابة تتأخر في الافتتاح صباحاً.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 21. Displaced → Manager
    {
        id: 21,
        date: '2024-10-07',
        sender: { id: 1, name: 'Yara Khaled', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'مشكلة في توزيع الطعام',
        body: 'الوجبات تصل بكمية قليلة.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 22. Delegate → Security Person
    {
        id: 22,
        date: '2024-10-07',
        sender: { id: 1, name: 'Basel Marwan', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'ازدحام شديد',
        body: 'الأفراد يتجاوزون الدور.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم ضبط الدخول والخروج.',
    },

    // 23. Displaced → Delegate
    {
        id: 23,
        date: '2024-10-06',
        sender: { id: 1, name: 'Muhannad Issa', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Mostafa Aljzar', image: '', role: USER_TYPE.DELEGATE },
        title: 'توقف الخدمات الطبية',
        body: 'لا يوجد طبيب في الفترة المسائية.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 24. Security Person → Manager
    {
        id: 24,
        date: '2024-10-06',
        sender: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'حاجة لزيادة أفراد الأمن',
        body: 'النقطة تحتاج شخصين إضافيين.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم توفير أفراد إضافيين.',
    },

    // 25. Displaced → Security Person
    {
        id: 25,
        date: '2024-10-05',
        sender: { id: 1, name: 'Reem Abu Qamar', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'خلاف أثناء التفتيش',
        body: 'حدث سوء تفاهم عند نقطة التفتيش.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 26. Delegate → Manager
    {
        id: 26,
        date: '2024-10-05',
        sender: { id: 1, name: 'Abdelrahman Yassin', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'تأخر في استلام المواد',
        body: 'تأخر تسليم الطرود اليومية.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم تأكيد موعد التسليم القادم.',
    },

    // 27. Security Person → Security Officer
    {
        id: 27,
        date: '2024-10-04',
        sender: { id: 1, name: 'Majdi Rafi', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Majed Omar', image: '', role: USER_RANK.SECURITY_OFFICER },
        title: 'نقص معدات الاتصال',
        body: 'أجهزة الاتصال لا تعمل جيداً.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 28. Displaced → Manager
    {
        id: 28,
        date: '2024-10-04',
        sender: { id: 1, name: 'Khaled Fadel', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'طلب تحسين الإضاءة',
        body: 'المنطقة مظلمة في الليل.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم تركيب إضاءة إضافية.',
    },

    // 29. Delegate → Security Person
    {
        id: 29,
        date: '2024-10-03',
        sender: { id: 1, name: 'Yasmeen Tamer', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'مشكلة في تنظيم الدخول',
        body: 'بعض المستفيدين يدخلون من غير تسجيل.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 30. Displaced → Delegate
    {
        id: 30,
        date: '2024-10-03',
        sender: { id: 1, name: 'Hasan Omar', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Mostafa Aljzar', image: '', role: USER_TYPE.DELEGATE },
        title: 'عدم توفر أدوية',
        body: 'المركز الصحي ينقصه أدوية أساسية.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم التواصل مع اللجنة الطبية.',
    },

    // 31. Security Person → Manager
    {
        id: 31,
        date: '2024-10-02',
        sender: { id: 1, name: 'Ahmad Basheer', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'تأخر في صرف الزي الرسمي',
        body: 'الزي الجديد لم يُسلّم بعد.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 32. Displaced → Security Person
    {
        id: 32,
        date: '2024-10-02',
        sender: { id: 1, name: 'Samira Hasan', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'ازدحام في نقطة الدخول',
        body: 'الانتظار يستغرق وقتاً طويلاً.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم فتح ممر إضافي.',
    },

    // 33. Delegate → Manager
    {
        id: 33,
        date: '2024-10-01',
        sender: { id: 1, name: 'Ward Alqam', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'نقص في الطاولات',
        body: 'الطاولات الحالية غير كافية.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 34. Displaced → Manager
    {
        id: 34,
        date: '2024-10-01',
        sender: { id: 1, name: 'Aseel Wael', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'طلب نقل عائلة',
        body: 'المنطقة الحالية مزدحمة جداً.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم دراسة الطلب.',
    },

    // 35. Security Person → Security Officer
    {
        id: 35,
        date: '2024-09-30',
        sender: { id: 1, name: 'Naeem Barakat', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Majed Omar', image: '', role: USER_RANK.SECURITY_OFFICER },
        title: 'مشكلة في جهاز البصمة',
        body: 'جهاز البصمة لا يعمل.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 36. Delegate → Security Person
    {
        id: 36,
        date: '2024-09-30',
        sender: { id: 1, name: 'Rashed Ali', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Rana Fathy', image: '', role: USER_TYPE.SECURITY_PERSON },
        title: 'خلاف في نقطة التسجيل',
        body: 'حدث شجار صغير بين المستفيدين.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم احتواء الموقف.',
    },

    // 37. Displaced → Delegate
    {
        id: 37,
        date: '2024-09-29',
        sender: { id: 1, name: 'Jalal Hassan', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Mostafa Aljzar', image: '', role: USER_TYPE.DELEGATE },
        title: 'عدم استلام وجبة',
        body: 'اسمي لم يكن على القائمة.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 38. Displaced → Manager
    {
        id: 38,
        date: '2024-09-29',
        sender: { id: 1, name: 'Nisreen Tayseer', image: '', role: USER_TYPE.DISPLACED },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'تأخر في نقل المرضى',
        body: 'الحالات تحتاج عربة إسعاف أسرع.',
        status: COMPLAINTS_STATUS.READ,
        response: 'تم تعزيز فريق الإسعاف.',
    },

    // 39. Security Person → Manager
    {
        id: 39,
        date: '2024-09-28',
        sender: { id: 1, name: 'Mona Rami', image: '', role: USER_TYPE.SECURITY_PERSON },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'تسرب مياه في النقطة',
        body: 'هناك تسرّب يعيق العمل.',
        status: COMPLAINTS_STATUS.PENDING,
    },

    // 40. Delegate → Manager
    {
        id: 40,
        date: '2024-09-28',
        sender: { id: 1, name: 'Ziad Hatem', image: '', role: USER_TYPE.DELEGATE },
        receiver: { id: 1, name: 'Yousef Said', image: '', role: USER_TYPE.MANAGER },
        title: 'مشكلة في جدول التوزيع',
        body: 'الجدول لا يناسب أعداد المستفيدين.',
        status: COMPLAINTS_STATUS.READ,
        response: 'سيتم تحديث الجدول.',
    },
];

export const fakeComplaintsResponse = ({
    page = 1,
    limit = 5,
    userVisitId,
    userVisitType,
    userAlreadyId,
    userAlreadyType,
    complaintType,
    dateRange,
    search,
    status
}: IGetComplaintsProps): IComplaintsResponse => {

    if (!fakeComplaints) {
        return {
            status: 500,
            message: 'حدث خطأ أثناء جلب الشكاوي',
            error: 'حدث خطأ أثناء جلب الشكاوي',
            complaints: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 }
        };
    }

    const isOwn = userVisitType === userAlreadyType && userVisitId === userAlreadyId;

    const filterByRelationship = (item: typeof fakeComplaints[0]) => {
        if (isOwn) {
            return (item.sender.id === userAlreadyId && item.sender.role === userAlreadyType) ||
                (item.receiver.id === userAlreadyId && item.receiver.role === userAlreadyType);
        }

        switch (userVisitType) {
            case USER_TYPE.DISPLACED:
                return (item.receiver.role === userAlreadyType && item.receiver.id === userAlreadyId) &&
                    (item.sender.role === USER_TYPE.DISPLACED && item.receiver.id === userVisitId);

            case USER_TYPE.MANAGER:
                return (item.sender.role === userAlreadyType && item.sender.id === userAlreadyId) ||
                    (item.receiver.role === userAlreadyType && item.receiver.id === userAlreadyId);

            case USER_TYPE.DELEGATE:
                if (userAlreadyType === USER_TYPE.DISPLACED) {
                    return item.sender.role === USER_TYPE.DISPLACED && item.sender.id === userAlreadyId &&
                        item.receiver.role === USER_TYPE.DELEGATE && item.receiver.id === userVisitId;
                }
                if (userAlreadyType === USER_TYPE.MANAGER) {
                    return item.sender.id === userVisitId && item.sender.role === USER_TYPE.DELEGATE &&
                        item.receiver.role === USER_TYPE.MANAGER && item.receiver.id === userAlreadyId;
                }
                if (userAlreadyType === USER_TYPE.SECURITY_PERSON || userAlreadyType === USER_RANK.SECURITY_OFFICER) {
                    return item.sender.id === userVisitId && item.sender.role === USER_TYPE.DELEGATE &&
                        (item.receiver.role === USER_TYPE.SECURITY_PERSON || item.receiver.role === USER_RANK.SECURITY_OFFICER);
                }
                return false;

            case USER_TYPE.SECURITY_PERSON:
            case USER_RANK.SECURITY_OFFICER:
                if (userAlreadyType === USER_TYPE.DISPLACED) {
                    return item.sender.role === USER_TYPE.DISPLACED && item.sender.id === userAlreadyId &&
                        (item.receiver.role === USER_TYPE.SECURITY_PERSON || item.receiver.role === USER_RANK.SECURITY_OFFICER);
                }
                if (userAlreadyType === USER_TYPE.DELEGATE) {
                    return item.sender.role === USER_TYPE.DELEGATE && item.sender.id === userAlreadyId &&
                        (item.receiver.role === USER_TYPE.SECURITY_PERSON || item.receiver.role === USER_RANK.SECURITY_OFFICER)
                }
                if (userAlreadyType === USER_TYPE.MANAGER) {
                    return (item.sender.role === USER_TYPE.SECURITY_PERSON || item.sender.role === USER_RANK.SECURITY_OFFICER) && item.sender.id === userVisitId &&
                        item.receiver.role === USER_TYPE.MANAGER && item.receiver.id === userAlreadyId;
                } if (userAlreadyType === USER_TYPE.SECURITY_PERSON) {
                    return (item.sender.role === USER_TYPE.SECURITY_PERSON || item.sender.role === USER_RANK.SECURITY_OFFICER) && item.sender.id === userAlreadyId &&
                        (item.receiver.role === USER_RANK.SECURITY_OFFICER);
                }
                return false;


            default:
                return false;
        }
    };

    let data = fakeComplaints.filter(filterByRelationship);

    // filter by complaint tab
    if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) {
        data = data.filter(item => item.sender.id === userAlreadyId && item.sender.role === userAlreadyType);
    } else if (complaintType === COMPLAINTS_TABS.RECEIVED_COMPLAINTS) {
        data = data.filter(item => item.receiver.id === userAlreadyId && item.receiver.role === userAlreadyType);
    }

    // filter by status
    if (status && status !== COMPLAINTS_STATUS.ALL) {
        data = data.filter(item => item.status === status);
    }

    // filter by search
    if (search) {
        const term = search.toLowerCase();
        data = data.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.body.toLowerCase().includes(term) ||
            item.sender.name.toLowerCase().includes(term) ||
            item.receiver.name.toLowerCase().includes(term)
        );
    }

    // filter by date range
    if (dateRange?.[0] && dateRange?.[1]) {
        const [start, end] = dateRange;
        data = data.filter(item => item.date >= start && item.date <= end);
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const complaints = data.slice((page - 1) * limit, page * limit);

    return {
        status: 200,
        message: 'نجح في جلب الشكاوي',
        complaints,
        pagination: { page, limit, totalItems, totalPages }
    };
};

