import { IGetDisplacedReceivedAidsProps } from "@/actions/actor/displaced/received-aids/getDisplacedReceivedAids";
import { DISPLACED_RECEIVED_AIDS_TABS, TYPE_AIDS } from "@/types/actor/common/index.type";
import { IDisplacedReceivedAid, IDisplacedReceivedAidsResponse } from "@/types/actor/displaced/received-aids/displacedReceivedAidsResponse.type";

export const fakeDisplacedReceivedAids: IDisplacedReceivedAid[] = [
    {
        id: 1,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "طرد غذائي شهري",
        aidType: TYPE_AIDS.FOOD_AID,
        aidContent: "أرز، سكر، زيت، طحين",
        deliveryLocation: "مخيم النصيرات",
        deliveryDate: new Date("2025-06-01"),
        receiptDate: new Date("2025-06-02"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 2,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "مساعدة مالية للأسر المحتاجة",
        aidType: TYPE_AIDS.FINANCIAL_AID,
        aidContent: "400 شيكل",
        deliveryLocation: "خان يونس - مكتب الشؤون",
        deliveryDate: new Date("2025-06-03"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 3,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "أدوية مزمنة",
        aidType: TYPE_AIDS.MEDICAL_AID,
        aidContent: "دواء ضغط وسكر",
        deliveryLocation: "مستشفى الشفاء",
        deliveryDate: new Date("2025-06-04"),
        receiptDate: new Date("2025-06-04"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 4,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "مواد تنظيف عامة",
        aidType: TYPE_AIDS.CLEANING_AID,
        aidContent: "صابون، كلور، معقم",
        deliveryLocation: "جباليا - مركز التوزيع",
        deliveryDate: new Date("2025-06-05"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 5,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "ملابس صيفية للأطفال",
        aidType: TYPE_AIDS.CLOTHING_AIDS,
        aidContent: "قمصان، سراويل، أحذية",
        deliveryLocation: "مخيم البريج",
        deliveryDate: new Date("2025-06-06"),
        receiptDate: new Date("2025-06-07"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 6,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "حقائب مدرسية",
        aidType: TYPE_AIDS.EDUCATIONAL_AID,
        aidContent: "حقيبة، دفاتر، أقلام",
        deliveryLocation: "مدرسة العودة",
        deliveryDate: new Date("2025-06-08"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 7,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "مساعدة نقدية",
        aidType: TYPE_AIDS.FINANCIAL_AID,
        aidContent: "350 شيكل",
        deliveryLocation: "رفح - البلدية",
        deliveryDate: new Date("2025-06-09"),
        receiptDate: new Date("2025-06-10"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 8,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "بطانيات ووسائد",
        aidType: TYPE_AIDS.OTHER_AID,
        aidContent: "بطانيتان، وسادتان",
        deliveryLocation: "النصيرات - جمعية الرحمة",
        deliveryDate: new Date("2025-06-11"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 9,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "ملابس شتوية",
        aidType: TYPE_AIDS.CLOTHING_AIDS,
        aidContent: "جاكيت، كنزة، حذاء",
        deliveryLocation: "الشمال - السوق المركزي",
        deliveryDate: new Date("2025-06-12"),
        receiptDate: new Date("2025-06-13"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 10,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "أجهزة لوحية للطلاب",
        aidType: TYPE_AIDS.EDUCATIONAL_AID,
        aidContent: "جهاز لوحي مع اتصال إنترنت",
        deliveryLocation: "جامعة غزة",
        deliveryDate: new Date("2025-06-14"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 11,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "سلة طعام رمضانية",
        aidType: TYPE_AIDS.FOOD_AID,
        aidContent: "أرز، معكرونة، تمر",
        deliveryLocation: "مركز الإحسان",
        deliveryDate: new Date("2025-06-15"),
        receiptDate: new Date("2025-06-16"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 12,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "منحة دراسية",
        aidType: TYPE_AIDS.EDUCATIONAL_AID,
        aidContent: "دفع رسوم الترم الأول",
        deliveryLocation: "جامعة الأزهر",
        deliveryDate: new Date("2025-06-17"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 13,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "منظفات منزلية",
        aidType: TYPE_AIDS.CLEANING_AID,
        aidContent: "مسحوق غسيل، معقم، كلور",
        deliveryLocation: "مخيم الشاطئ",
        deliveryDate: new Date("2025-06-18"),
        receiptDate: new Date("2025-06-19"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 14,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "خيام للمُهجرين",
        aidType: TYPE_AIDS.OTHER_AID,
        aidContent: "خيمة، بطانية، فرشة",
        deliveryLocation: "خزاعة",
        deliveryDate: new Date("2025-06-20"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 15,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "مساعدة غذائية طارئة",
        aidType: TYPE_AIDS.FOOD_AID,
        aidContent: "علب فول، بسكويت، ماء",
        deliveryLocation: "رفح - الهلال الأحمر",
        deliveryDate: new Date("2025-06-21"),
        receiptDate: new Date("2025-06-21"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 16,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "توفير أدوية نادرة",
        aidType: TYPE_AIDS.MEDICAL_AID,
        aidContent: "دواء كيماوي",
        deliveryLocation: "مستشفى الأوروبي",
        deliveryDate: new Date("2025-06-22"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
    {
        id: 17,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "ملابس رياضية",
        aidType: TYPE_AIDS.CLOTHING_AIDS,
        aidContent: "تيشيرت، شورت، حذاء رياضي",
        deliveryLocation: "مركز شباب الرمال",
        deliveryDate: new Date("2025-06-23"),
        receiptDate: new Date("2025-06-24"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 18,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "تمويل مشروع صغير",
        aidType: TYPE_AIDS.FINANCIAL_AID,
        aidContent: "1000 شيكل",
        deliveryLocation: "غزة - بنك فلسطين",
        deliveryDate: new Date("2025-06-25"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 19,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS,
        aidName: "حقيبة مستلزمات مدرسية",
        aidType: TYPE_AIDS.EDUCATIONAL_AID,
        aidContent: "حقيبة، دفاتر، أقلام",
        deliveryLocation: "مدرسة الكرامة",
        deliveryDate: new Date("2025-06-26"),
        receiptDate: new Date("2025-06-26"),
        aidGiver: { giverId: 1, name: "mostafa aljzar", role: "DELEGATE" },
    },
    {
        id: 20,
        tabType: DISPLACED_RECEIVED_AIDS_TABS.PROVIDED_AIDS,
        aidName: "مساعدات منزلية",
        aidType: TYPE_AIDS.OTHER_AID,
        aidContent: "ثلاجة، غاز صغير",
        deliveryLocation: "الزوايدة",
        deliveryDate: new Date("2025-06-27"),
        aidGiver: { giverId: 1, name: "مصطفى يوسف", role: "MANAGER" },
    },
];

export const fakeDisplacedReceivedAidsResponse = ({
    page = 1,
    limit = 10,
    tabType,
}: IGetDisplacedReceivedAidsProps): IDisplacedReceivedAidsResponse => {

    const displacedReceivedAids = fakeDisplacedReceivedAids

    if (!displacedReceivedAids) {
        return {
            status: 500,
            message: 'حدث خطأ أثناء جلب المساعدات',
            error: 'حدث خطأ أثناء جلب المساعدات',
            receivedAids: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
        };
    }

    const filtered = tabType
        ? displacedReceivedAids.filter((aid) => aid.tabType === tabType)
        : displacedReceivedAids;

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedAids = filtered.slice((page - 1) * limit, page * limit);

    const fakeResponse: IDisplacedReceivedAidsResponse = {
        status: 200,
        receivedAids: paginatedAids,
        pagination: { page, limit, totalItems, totalPages },
    };


    return fakeResponse
};
