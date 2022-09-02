import { useSelector } from 'react-redux';
import { NotificationState } from '@/Store/Notification';

export default () =>
  useSelector(
    (state: { notification: NotificationState }) => state.notification
  );
