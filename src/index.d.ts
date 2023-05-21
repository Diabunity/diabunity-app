import { type ViewName } from '@/Constants/views';

declare module 'react-native-slack-emoji/src';

type NotificationType = 'navigate' | 'static';

/**
 * Data received within data property of Firebase notification
 * this is the data received from the server
 * @type {NotificationType} type of notification
 * @go_to {string} name of the view to navigate
 * @staticPropExample {string} TODO:// this is an example
 */
interface FirebaseResponseData {
  type: NotificationType;
  go_to?: string;
  staticPropExample?: string; // This is just an example, you can add more properties
}

/**
 * Object containing data from the notification + parsed data
 * This object may contain new properties depending on the type of notification
 *
 * @type {NotificationType} type of notification
 * @goTo {string} name of the view to navigate
 * @staticProp {string} TODO:// this is an example
 * @navigationRef {React.RefObject} navigation reference
 */
interface ParsedObject {
  type: NotificationType;
  goTo?: viewName;
  staticProp?: string;
  navigationRef?: any;
}

/**
 * Data received within data property of Firebase notification
 *
 * @type {NotificationType} type of notification
 * @go_to {string} name of the view to navigate
 */
interface NotificationData {
  type: NotificationType;
  go_to?: ViewName;
}

export declare global {
  var notificationData: ParsedObject | null;
}
