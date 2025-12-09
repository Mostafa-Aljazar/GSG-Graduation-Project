import { TYPE_WRITTEN_CONTENT } from "@/types/common/index.type";

// LANDING_ROUTES
export const LANDING_ROUTES = {
  HOME: '/',
  OUR_SERVICES: '/#our-service',
  CONTACT_US: '#contact-us',
  BLOG: '/blog',
  SUCCESS_STORIES: '/success-stories',
} as const;

// AUTH_ROUTES
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  FORGET_PASSWORD: '/auth/forget-password',
  OTP: '/auth/otp',
  CREATE_NEW_PASSWORD: '/auth/create-new-password',
} as const;



/////////////////////////////////////////////////////////////
// ACTOR ROUTES FUNCTIONS
/////////////////////////////////////////////////////////////


export const GENERAL_ACTOR_ROUTES = {
  // GENERAL
  ADS: '/actor/ads',
  DELEGATES: '/actor/delegates',
  ADD_DELEGATES: '/actor/delegates/add',
  DISPLACEDS: '/actor/displaceds',
  ADD_DISPLACEDS: '/actor/displaceds/add',
  SECURITIES: '/actor/securities',
  ADD_SECURITIES: '/actor/securities/add',
  NOTIFICATIONS: '/actor/notifications',

} as const;

export const getDisplacedRoutes = (
  {
    displacedId
  }: {
    displacedId: string
  }) => {
  return {
    PROFILE: `/actor/displaceds/${displacedId}/profile`,
    COMPLAINTS: `/actor/displaceds/${displacedId}/complaints`,
    RECEIVED_AIDS: `/actor/displaceds/${displacedId}/received-aids`,
  } as const;
};

export const getDelegateRoutes = (
  {
    delegateId, aidId
  }: {
    delegateId: string,
    aidId?: string
  }
) => {
  return {
    PROFILE: `/actor/delegates/${delegateId}/profile`,
    COMPLAINTS: `/actor/delegates/${delegateId}/complaints`,
    REPORTS: `/actor/delegates/${delegateId}/reports`,

    // AIDS_MANAGEMENT
    AIDS_MANAGEMENT: `/actor/delegates/${delegateId}/aids-management`,
    ADD_AID_DISPLACEDS: `/actor/delegates/${delegateId}/aids-management/${aidId}/add-displaceds`,
    AID: `/actor/delegates/${delegateId}/aids-management/${aidId}`,
  } as const;
};


export const getManagerRoutes = (
  {
    managerId,
    aidId,
    writtenContent
  }: {
    managerId: string,
    aidId?: string,
    writtenContent?: {
      id: string,
      type: TYPE_WRITTEN_CONTENT,
    }

  }
) => {
  return {

    PROFILE: `/actor/manager/${managerId}/profile`,
    REPORTS: `/actor/manager/${managerId}/reports`,
    COMPLAINTS: `/actor/manager/${managerId}/complaints`,

    // WRITTEN_CONTENT
    WRITTEN_CONTENTS: `/actor/manager/${managerId}/written-content`,
    WRITTEN_CONTENT: `/actor/manager/${managerId}/written-content/${writtenContent?.id}?written-tab=${writtenContent?.type}`,
    ADD_WRITTEN_CONTENT: `/actor/manager/${managerId}/written-content/add`,


    // AIDS_MANAGEMENT
    AIDS_MANAGEMENT: `/actor/manager/${managerId}/aids-management`,
    ADD_AID: `/actor/manager/${managerId}/aids-management/add`,
    AID: `/actor/manager/${managerId}/aids-management/${aidId}`,

  } as const;
};

export const getSecurityRoutes = (
  { securityId }: {
    securityId: string,
  }) => {
  return {
    PROFILE: `/actor/securities/${securityId}/profile`,
    COMPLAINTS: `/actor/securities/${securityId}/complaints`,
    TASKS: `/actor/securities/${securityId}/tasks`,
  } as const;
};