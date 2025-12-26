import { IMG_LOGO } from '@/assets/common';
import { BLOG_PAGE, HOME_PAGE, STORIES_PAGE } from '@/assets/common/manifest';
import { LANDING_ROUTES } from '@/constants/routes';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'AL-AQSA Camp | إدارة مخيم الأقصى للنازحين',
        short_name: 'AL-AQSA Camp',
        description:
            'منصة ويب لإدارة مخيم الأقصى للنازحين في غزة باستخدام تقنيات حديثة لتوزيع المساعدات، التعامل مع الشكاوى، وتحسين التواصل في الوقت الحقيقي.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3e704c',
        orientation: 'any',
        dir: 'rtl',
        lang: 'ar',
        categories: ['humanitarian', 'management', 'aid', 'disaster_response'],
        id: '/al-aqsa-camp',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '48x48 72x72 96x96 128x128 256x256',
                type: 'image/x-icon',
            },
            {
                src: IMG_LOGO.src,
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        screenshots: [
            {
                src: HOME_PAGE.src,
                sizes: '1280x720',
                type: 'image/png',
            },
            {
                src: BLOG_PAGE.src,
                sizes: '1280x720',
                type: 'image/png',
            },
            {
                src: STORIES_PAGE.src,
                sizes: '1280x720',
                type: 'image/png',
            },
        ],
        shortcuts: [
            {
                name: 'الصفحة الرئيسية',
                short_name: 'الرئيسية',
                description:
                    'الصفحة الرئيسية لمخيم الأقصى حيث نعرض رسالتنا، من نحن، وأهدافنا في تقديم المساعدات الإنسانية والإغاثية في قطاع غزة.',
                url: LANDING_ROUTES.HOME,
                icons: [{ src: HOME_PAGE.src, sizes: '128x128', type: 'image/png' }],
            },
            {
                name: 'صفحة المدونة',
                short_name: 'المدونة',
                description:
                    'مدونتنا تحتوي على مقالات تسلط الضوء على أنشطتنا، قصص الصمود، الإنجازات، وكل ما يحدث داخل المخيم لمشاركة المعرفة والأمل.',
                url: LANDING_ROUTES.BLOG,
                icons: [{ src: BLOG_PAGE.src, sizes: '128x128', type: 'image/png' }],
            },
            {
                name: 'صفحة قصص النجاح',
                short_name: 'قصص النجاح',
                description:
                    'قصص نجاحنا التي تحكي عن أبطال المخيم، إرادتهم، وكيف تحول الألم إلى أمل بمساعدة الجهود التطوعية.',
                url: LANDING_ROUTES.SUCCESS_STORIES,
                icons: [{ src: STORIES_PAGE.src, sizes: '128x128', type: 'image/png' }],
            },
        ],
    };
}
