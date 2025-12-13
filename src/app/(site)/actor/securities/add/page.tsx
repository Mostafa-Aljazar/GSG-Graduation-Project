import SecurityProfileForm from '@/components/actor/securities/profile/security-profile-form';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';

export default function AddSecurityPage() {
  return <SecurityProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
