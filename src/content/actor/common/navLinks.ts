import {
    GENERAL_ACTOR_ROUTES,
    getDelegateRoutes,
    getDisplacedRoutes,
    getManagerRoutes,
    getSecurityRoutes,

} from '@/constants/routes';

import {
    BellRing, Newspaper, Handshake, User, Users, FileChartLine, MessageCircleWarning, ShieldUser, Database, ListTodo
} from 'lucide-react';

import { USER_TYPE, USER_RANK } from '@/constants/user-types';

export type TViewMode = 'self' | 'guest' | 'limited';

export interface NavLink {
    label: string;
    href: string;
    icon: any;
}

export const getNavLinks = ({
    userRank, userId, view = 'self'
}: {

    userRank: USER_TYPE | USER_RANK,
    userId: number,
    view: TViewMode
}
): readonly NavLink[] => {

    switch (userRank) {
        case USER_TYPE.DELEGATE: {
            const routes = getDelegateRoutes({ delegateId: userId });
            //what appear to delegate 
            if (view === 'self') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'الإشعارات', href: GENERAL_ACTOR_ROUTES.NOTIFICATIONS, icon: BellRing },
                { label: 'بيانات النازحين', href: GENERAL_ACTOR_ROUTES.DISPLACEDS, icon: Users },
                { label: 'إدارة المساعدات', href: routes.AIDS_MANAGEMENT, icon: Handshake },
                { label: 'التقارير', href: routes.REPORTS, icon: FileChartLine },
                { label: 'الإعلانات', href: GENERAL_ACTOR_ROUTES.ADS, icon: Newspaper },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const;

            //what appear when manger or security officer open Delegate pages
            if (view === 'guest') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'إدارة المساعدات', href: routes.AIDS_MANAGEMENT, icon: Handshake },
                { label: 'التقارير', href: routes.REPORTS, icon: FileChartLine },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const;

            //what appear when displaced open Delegate pages
            return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const; // limited
        }

        case USER_TYPE.DISPLACED: {
            const routes = getDisplacedRoutes({ displacedId: userId });
            //what appear to displaced 
            if (view === 'self') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'الإشعارات', href: GENERAL_ACTOR_ROUTES.NOTIFICATIONS, icon: BellRing },
                { label: 'الإعلانات', href: GENERAL_ACTOR_ROUTES.ADS, icon: Newspaper },
                { label: 'المساعدات المستقبلة', href: routes.RECEIVED_AIDS, icon: Handshake },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const;

            //what appear when manger or delegate or security open displaced pages
            return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'المساعدات المستقبلة', href: routes.RECEIVED_AIDS, icon: Handshake },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const;
        }

        case USER_TYPE.MANAGER: {
            const routes = getManagerRoutes({ managerId: userId });
            //what appear to manager 
            if (view === 'self') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'بيانات النازحين', href: GENERAL_ACTOR_ROUTES.DISPLACEDS, icon: Database },
                { label: 'بيانات المناديب', href: GENERAL_ACTOR_ROUTES.DELEGATES, icon: Users },
                { label: 'بيانات الأمن', href: GENERAL_ACTOR_ROUTES.SECURITIES, icon: ShieldUser },
                { label: 'إدارة المساعدات', href: routes.AIDS_MANAGEMENT, icon: Handshake },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
                { label: 'التقارير', href: routes.REPORTS, icon: FileChartLine },
                { label: 'الإعلانات و المدونات', href: routes.ADS_BLOGS_STORIES, icon: Newspaper },
            ] as const;

            //what appear when any user open manager pages
            return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
            ] as const;
        }

        case USER_TYPE.SECURITY_PERSON:
        case USER_RANK.SECURITY_OFFICER: {
            const routes = getSecurityRoutes({ securityId: userId });
            //what appear to security 
            if (view === 'self') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'الإشعارات', href: GENERAL_ACTOR_ROUTES.NOTIFICATIONS, icon: BellRing },
                { label: 'بيانات الأمن', href: GENERAL_ACTOR_ROUTES.SECURITIES, icon: ShieldUser },
                { label: 'المهام', href: routes.TASKS, icon: ListTodo },
                { label: 'بيانات النازحين', href: GENERAL_ACTOR_ROUTES.DISPLACEDS, icon: Users },
                { label: 'بيانات المناديب', href: GENERAL_ACTOR_ROUTES.DELEGATES, icon: Database },
                { label: 'الشكاوي', href: routes.COMPLAINTS, icon: MessageCircleWarning },
                { label: 'الإعلانات', href: GENERAL_ACTOR_ROUTES.ADS, icon: Newspaper },
            ] as const;

            //what appear when manger or security officer open security page
            if (view === 'guest') return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
                { label: 'المهام', href: routes.TASKS, icon: ListTodo },
            ] as const;

            //what appear when other users open security page
            return [
                { label: 'الملف الشخصي', href: routes.PROFILE, icon: User },
            ] as const;
        }

        default:
            return [];
    }
};
