import { useSelector } from 'react-redux';

import { User } from '@/Services/modules/users';

export default () => useSelector((state: { user: User }) => state.user);
