import { DisplacedProfileForm } from '@/components';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/actors-information.type';

const DisplacedAdd = () => {
  return <DisplacedProfileForm destination={ACTION_ADD_EDIT_DISPLAY.ADD} />;
};

export default DisplacedAdd;
