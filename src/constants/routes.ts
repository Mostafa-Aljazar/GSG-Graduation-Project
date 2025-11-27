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
export const getDisplacedRoutes = (
  {
    displacedId
  }: {
    displacedId: number
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
    delegateId: number,
    aidId?: number
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
    writtenContentId
  }: {
    managerId: number,
    aidId?: number,
    writtenContentId?: number
  }
) => {
  return {

    PROFILE: `/actor/manager/${managerId}/profile`,
    REPORTS: `/actor/manager/${managerId}/reports`,
    COMPLAINTS: `/actor/manager/${managerId}/complaints`,

    // ADS_BLOGS
    ADS_BLOGS_STORIES: `/actor/manager/${managerId}/written-content`,
    AD_BLOG_STORY: `/actor/manager/${managerId}/written-content/${writtenContentId}`,
    ADD_ADS_BLOGS_STORIES: `/actor/manager/${managerId}/written-content/add`,


    // AIDS_MANAGEMENT
    AIDS_MANAGEMENT: `/actor/manager/${managerId}/aids-management`,
    ADD_AID: `/actor/manager/${managerId}/aids-management/add`,
    AID: `/actor/manager/${managerId}/aids-management/${aidId}`,

  } as const;
};

export const getSecurityRoutes = (
  { securityId }: {
    securityId: number,
  }) => {
  return {
    PROFILE: `/actor/securities/${securityId}/profile`,
    COMPLAINTS: `/actor/securities/${securityId}/complaints`,
    TASKS: `/actor/securities/${securityId}/tasks`,
  } as const;
};