import { LANDING_ROUTES } from "@/constants/routes";


export const NAVBAR_LINKS = [
    {
        key: 'HOME',
        label: 'الرئيسية',
        link: LANDING_ROUTES.HOME,
    },
    {
        key: 'OUR_SERVICES',
        label: 'خدماتنا',
        link: LANDING_ROUTES.OUR_SERVICES,
    },
    {
        key: 'BLOG',
        label: 'المدونة',
        link: LANDING_ROUTES.BLOG,
    },
    ,
    {
        key: 'SUCCESS_STORY',
        label: 'قصص نجاح',
        link: LANDING_ROUTES.SUCCESS_STORY,
    },
    {
        key: 'CONTACT_US',
        label: 'تواصل معنا',
        link: LANDING_ROUTES.CONTACT_US,
    },
] as const;