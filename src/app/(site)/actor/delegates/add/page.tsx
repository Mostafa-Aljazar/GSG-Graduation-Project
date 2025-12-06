import DelegateProfileForm from '@/components/actor/delegate/profile/delegate-profile-form';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/actors-information.type';

export default function DelegateAdd() {
  return <DelegateProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
