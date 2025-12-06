import DelegateProfileForm from '@/components/actor/delegates/profile/delegate-profile-form';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';

export default function DelegateAdd() {
  return <DelegateProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
