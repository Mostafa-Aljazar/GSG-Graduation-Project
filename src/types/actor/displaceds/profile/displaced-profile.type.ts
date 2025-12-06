import { USER_TYPE, } from '@/constants/user-types';
import { ACCOMMODATION_TYPE, AGES, FAMILY_STATUS_TYPE, GENDER, SOCIAL_STATUS } from '../../common/index.type';


export interface IDelegateName {
  id: string;
  name: string;
}

export interface IDisplacedProfile {
  id?: number; //HINT: optional in create delegate
  name: string;
  email: string;
  gender: GENDER;
  profileImage: string;
  identity: string;
  nationality: string;
  originalAddress: string;
  mobileNumber: string;
  alternativeMobileNumber?: string;

  wives: {
    name: string;
    identity: string;
    nationality: string;
    isPregnant: boolean;
    isWetNurse: boolean;
  }[];

  socialStatus: {
    status: SOCIAL_STATUS;
    numberOfWives: number;
    numberOfMales: number;
    numberOfFemales: number;
    totalFamilyMembers: number;
    ageGroups: Record<AGES, number>;
  };

  displacement: {
    tentNumber: string;
    tentType: ACCOMMODATION_TYPE;

    familyStatusType: FAMILY_STATUS_TYPE;
    displacementDate: string;

    delegate: IDelegateName;
  };

  warInjuries: {
    name: string;
    injury: string;
  }[];

  martyrs: {
    name: string;
  }[];

  medicalConditions: {
    name: string;
    condition: string;
  }[];

  role: USER_TYPE.DISPLACED;

  rank: USER_TYPE.DISPLACED;

  additionalNotes: string;
}


export interface IDisplacedProfileResponse {
  status: number;
  message?: string;
  user: IDisplacedProfile;
  error?: string;
}
