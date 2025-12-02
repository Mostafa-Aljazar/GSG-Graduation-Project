import { IComplaint, IComplaintResponse } from '@/types/actor/general/complaints/complaints-response.type';
import { USER_TYPE } from '@/constants/user-types';
import { IGetCommonComplaintsProps } from '@/actions/actor/genral/complaints/getCommonComplaints';
import { COMPLAINTS_STATUS } from '@/types/actor/common/index.type';


export const fakeComplaints: IComplaint[] = [
    {
        id: 1,
        date: '2024-10-20',
        sender: {
            id: 1,
            name: "ameer abu draze",
            image: 'https://example.com/images/mohamed.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 1,
            name: "mostafa aljzar",
            image: 'https://example.com/images/ahmed.jpg',
            role: USER_TYPE.DELEGATE,
        },
        title: 'مشكلة في الإيواء',
        body: 'الخيمة التي أعيش بها غير صالحة للسكن.',
        status: COMPLAINTS_STATUS.PENDING,
    },
    {
        id: 2,
        date: '2024-10-20',
        sender: {
            id: 1,
            name: "ameer abu draze",
            image: 'https://example.com/images/mohamed.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 1,
            name: "mostafa aljzar",
            image: 'https://example.com/images/ahmed.jpg',
            role: USER_TYPE.DELEGATE,
        },
        title: 'نقص في المياه',
        body: 'المنطقة تعاني من انقطاع المياه المستمر.',
        status: COMPLAINTS_STATUS.READ,
    },
    {
        id: 3,
        date: '2024-10-19',
        sender: {
            id: 1,
            name: "ameer abu draze",
            image: 'https://example.com/images/mohamed.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 1,
            name: "mostafa aljzar",
            image: 'https://example.com/images/ahmed.jpg',
            role: USER_TYPE.DELEGATE,
        },
        title: 'شكاوي متكررة',
        body: 'تم تقديم نفس الشكوى عدة مرات بدون أي استجابة.',
        status: COMPLAINTS_STATUS.READ,
    },
    {
        id: 4,
        date: '2024-10-18',
        sender: {
            id: 4,
            name: 'هالة خليل',
            image: 'https://example.com/images/hala.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 13,
            name: 'يوسف زيد',
            image: 'https://example.com/images/yousef.jpg',
            role: USER_TYPE.SECURITY_PERSON,
        },
        title: 'سوء معاملة',
        body: 'تم معاملتي بطريقة سيئة عند نقطة التفتيش.',
        status: COMPLAINTS_STATUS.PENDING,
    },
    {
        id: 5,
        date: '2024-10-18',
        sender: {
            id: 5,
            name: 'سليم عماد',
            image: 'https://example.com/images/saleem.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 14,
            name: 'نجوى عادل',
            image: 'https://example.com/images/najwa.jpg',
            role: USER_TYPE.MANAGER,
        },
        title: 'طلب نقل',
        body: 'أرغب بنقل خيمتي لمكان أقل ازدحامًا.',
        status: COMPLAINTS_STATUS.PENDING,
    },
    {
        id: 6,
        date: '2024-10-17',
        sender: {
            id: 6,
            name: 'أحمد جهاد',
            image: 'https://example.com/images/jihad.jpg',
            role: USER_TYPE.DELEGATE,
        },
        receiver: {
            id: 15,
            name: 'رنا فتحي',
            image: 'https://example.com/images/rana.jpg',
            role: USER_TYPE.SECURITY_PERSON,
        },
        title: 'تأخير في الاستجابة',
        body: 'الشكوى لم يتم الرد عليها منذ أكثر من أسبوع.',
        status: COMPLAINTS_STATUS.READ,
    },

    {
        id: 8,
        date: '2024-10-16',
        sender: {
            id: 8,
            name: 'سماح نبيل',
            image: 'https://example.com/images/samah.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 17,
            name: 'ليلى عوني',
            image: 'https://example.com/images/leila.jpg',
            role: USER_TYPE.MANAGER,
        },
        title: 'عدم توفر كهرباء',
        body: 'انقطاع دائم في الكهرباء خلال الليل.',
        status: COMPLAINTS_STATUS.READ,
    },
    {
        id: 9,
        date: '2024-10-15',
        sender: {
            id: 9,
            name: 'حسين نمر',
            image: 'https://example.com/images/hussein.jpg',
            role: USER_TYPE.SECURITY_PERSON,
        },
        receiver: {
            id: 18,
            name: 'إياد ناصر',
            image: 'https://example.com/images/eyad.jpg',
            role: USER_TYPE.DELEGATE,
        },
        title: 'سوء تفاهم',
        body: 'حدث سوء فهم أثناء توزيع المساعدات.',
        status: COMPLAINTS_STATUS.PENDING,
    },
    {
        id: 10,
        date: '2024-10-14',
        sender: {
            id: 10,
            name: 'ليلى جهاد',
            image: 'https://example.com/images/leila.jpg',
            role: USER_TYPE.DISPLACED,
        },
        receiver: {
            id: 19,
            name: 'أمجد هاني',
            image: 'https://example.com/images/amjad.jpg',
            role: USER_TYPE.SECURITY_PERSON,
        },
        title: 'مشكلة لوجستية',
        body: 'المواد لم تصل في الوقت المحدد.',
        status: COMPLAINTS_STATUS.PENDING,
    },

]

export const fakeComplaintsResponse = ({
    page = 1,
    limit = 5,
    status = COMPLAINTS_STATUS.ALL,
    date_range = [null, null],
    search = '',
    complaint_type,
    role,
    actor_Id,
}: IGetCommonComplaintsProps): IComplaintResponse => {

    if (!fakeComplaints) {
        return {
            status: 500,
            message: 'حدث خطأ أثناء جلب الشكاوي',
            error: 'حدث خطأ أثناء جلب الشكاوي',
            complaints: [],
            pagination: { page: 1, limit: 0, total_items: 0, total_pages: 0 },
        };
    }

    // const fakeComplaintsData = fakeComplaints.filter((item => item.receiver.role == role));
    const fakeComplaintsData = fakeComplaints
    const total_items = fakeComplaintsData.length;
    const total_pages = Math.ceil(total_items / limit);
    const paginatedComplaints = fakeComplaintsData.slice((page - 1) * limit, page * limit);

    const fakeResponse: IComplaintResponse = {
        status: 200,
        complaints: paginatedComplaints,
        pagination: { page, limit, total_items, total_pages },
    };

    return fakeResponse
};
