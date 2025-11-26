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
        key: 'SUCCESS_STORIES',
        label: 'قصص نجاح',
        link: LANDING_ROUTES.SUCCESS_STORIES,
    },
    {
        key: 'CONTACT_US',
        label: 'تواصل معنا',
        link: LANDING_ROUTES.CONTACT_US,
    },
] as const;