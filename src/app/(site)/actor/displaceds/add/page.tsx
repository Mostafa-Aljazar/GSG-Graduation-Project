import DisplacedProfileForm from '@/components/actor/displaceds/profile/displaced-profile-form';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';

export default function DisplacedAdd() {
  return <DisplacedProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
}
