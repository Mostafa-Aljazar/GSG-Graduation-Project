import { IGetSecuritiesTasksProps } from "@/actions/actor/securities/tasks/getSecurityTasks";
import { TASKS_TABS } from "@/types/actor/common/index.type";
import { ITask, ITasksResponse } from "@/types/actor/security/tasks/TasksResponse.type";


export const FAKE_TASKS: ITask[] = [
    {
        id: 1,
        dateTime: new Date("2025-07-01T08:00:00"),
        title: "جولة صباحية في المخيم",
        body: "تفقد النقاط الأمنية الرئيسية.",
        securitiesIds: [1, 2],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 2,
        dateTime: new Date("2025-07-02T10:30:00"),
        title: "تأمين زيارة وفد خارجي",
        body: "مرافقة الوفد إلى مركز التدريب.",
        securitiesIds: [3, 4],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 3,
        dateTime: new Date("2025-07-03T14:00:00"),
        title: "تثبيت كاميرا مراقبة",
        body: "تركيب كاميرا جديدة في الجهة الشرقية.",
        securitiesIds: [5],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 4,
        dateTime: new Date("2025-07-04T16:00:00"),
        title: "مرافقة حافلة طلاب",
        body: "مرافقة أمنية لنقل الطلاب إلى خارج المخيم.",
        securitiesIds: [6, 7],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 5,
        dateTime: new Date("2025-07-05T18:00:00"),
        title: "تأمين اجتماع لجنة الطوارئ",
        body: "التواجد أمام مركز الخدمات الصحية.",
        securitiesIds: [8],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 6,
        dateTime: new Date("2025-07-06T20:30:00"),
        title: "مراقبة النشاط الليلي",
        body: "مراقبة التحركات في المنطقة الجنوبية.",
        securitiesIds: [9],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 7,
        dateTime: new Date("2025-07-07T07:45:00"),
        title: "تحقق من الإنذارات",
        body: "مراجعة الإنذارات الأمنية في نقطة المراقبة رقم 3.",
        securitiesIds: [12, 11, 10],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 8,
        dateTime: new Date("2025-07-08T09:15:00"),
        title: "صيانة نظام الإنذار",
        body: "إغلاق النظام مؤقتًا لإجراء الصيانة.",
        securitiesIds: [11, 12],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 9,
        dateTime: new Date("2025-07-09T13:30:00"),
        title: "تنظيم دخول المساعدات",
        body: "التأكد من مطابقة القوائم والتفتيش.",
        securitiesIds: [14, 15, 16, 13],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 10,
        dateTime: new Date("2025-07-10T15:00:00"),
        title: "مرافقة حالات طبية",
        body: "نقل 3 حالات طبية إلى النقطة الطبية.",
        securitiesIds: [20, 14, 115],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 11,
        dateTime: new Date("2025-06-30T11:00:00"),
        title: "استجابة لشكوى ضوضاء",
        body: "التحقق من تجمع غير مصرح به.",
        securitiesIds: [16, 17, 18, 19],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 12,
        dateTime: new Date("2025-06-29T17:00:00"),
        title: "نقل مواد تموينية",
        body: "مرافقة شاحنة تموين من البوابة إلى المخزن.",
        securitiesIds: [17, 18, 19, 12, 5],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 13,
        dateTime: new Date("2025-06-28T19:00:00"),
        title: "إغلاق مداخل ثانوية",
        body: "إغلاق البوابة الشرقية مؤقتًا لأعمال الصيانة.",
        securitiesIds: [18, 20, 22, 25],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 14,
        dateTime: new Date("2025-07-11T12:30:00"),
        title: "تأمين فعالية داخلية",
        body: "تأمين منطقة الفعالية في المركز الثقافي.",
        securitiesIds: [19, 20, 15, 5],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 15,
        dateTime: new Date("2025-07-12T21:00:00"),
        title: "دورية ليلية",
        body: "تفقد الجهة الشمالية للمخيم.",
        securitiesIds: [20, 1, 2, 3, 4],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 16,
        dateTime: new Date("2025-07-13T10:00:00"),
        title: "مراجعة كاميرات المراقبة",
        body: "تحليل تسجيلات الليلة السابقة.",
        securitiesIds: [21, 5, 8, 6, 15, 12],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 17,
        dateTime: new Date("2025-07-14T18:45:00"),
        title: "تنظيم خروج السكان",
        body: "تنسيق الخروج بسبب أعمال صيانة عامة.",
        securitiesIds: [22, 23, 25],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 18,
        dateTime: new Date("2025-07-15T22:00:00"),
        title: "استعداد طارئ",
        body: "تجهيز أفراد الأمن لحالة طارئة محتملة.",
        securitiesIds: [24, 14, 5],
        type: TASKS_TABS.UPCOMING_TASKS,
    },
    {
        id: 19,
        dateTime: new Date("2025-06-27T09:00:00"),
        title: "مراقبة بوابة المخيم",
        body: "تمت المراقبة بنجاح دون مخالفات.",
        securitiesIds: [25, 24, 12, 16, 18],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
    {
        id: 20,
        dateTime: new Date("2025-06-26T08:30:00"),
        title: "نقل مستندات حساسة",
        body: "مرافقة أمنية لنقل مستندات إلى الإدارة.",
        securitiesIds: [12, 17, 15, 8, 6, 9, 7, 2, 4],
        type: TASKS_TABS.COMPLETED_TASKS,
    },
];

export const fakeTasksResponse = ({
    page = 1,
    limit = 10,
    taskType,
}: IGetSecuritiesTasksProps): ITasksResponse => {
    const filteredTasks = FAKE_TASKS.filter(task => task.type === taskType);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTasks = filteredTasks.slice(start, end);

    return {
        status: 200,
        message: "تم جلب المهام الأمنية بنجاح",
        tasks: paginatedTasks,
        pagination: {
            page,
            limit,
            totalItems: filteredTasks.length,
            totalPages: Math.ceil(filteredTasks.length / limit),
        },
    };
};