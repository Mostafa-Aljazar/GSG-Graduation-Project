import { USER_RANK, USER_TYPE, } from '@/constants/user-types';
import { ACCOMMODATION_TYPE, AGES, FAMILY_STATUS_TYPE, SOCIAL_STATUS } from '../../common/index.type';
import { IBaseProfile } from '../../common/user/base-profile.type';

// ----------------- DISPLACED -----------------
export interface IDelegateName {
  id: string;
  name: string;
}

export interface IDisplacedSocialStatus {
  status: SOCIAL_STATUS;
  numberOfWives: number;
  numberOfMales: number;
  numberOfFemales: number;
  totalFamilyMembers: number;
  ageGroups: Record<AGES, number>;
}

export interface IDisplacedProfile extends IBaseProfile {
  role: USER_TYPE.DISPLACED;
  rank: USER_RANK.DISPLACED;

  originalAddress: string;

  wives: {
    name: string;
    identity: string;
    nationality: string;
    isPregnant: boolean;
    isWetNurse: boolean;
  }[];

  socialStatus: IDisplacedSocialStatus;

  displacement: {
    tentNumber: string;
    tentType: ACCOMMODATION_TYPE;
    familyStatusType: FAMILY_STATUS_TYPE;
    displacementDate: string;
    delegate: IDelegateName;
  };

  warInjuries: { name: string; injury: string }[];
  martyrs: { name: string }[];
  medicalConditions: { name: string; condition: string }[];
  additionalNotes?: string;
}

export interface IDisplacedProfileResponse {
  status: number;
  message: string;
  user: IDisplacedProfile;
  error?: string;
}
