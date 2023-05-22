import { type ViewName, type NavigationViewName } from '@/Constants/views';

declare module 'react-native-slack-emoji/src';

export enum NotificationType {
  NAVIGATE = 'navigate',
  STATIC = 'static',
}

/**
 * Data received within data property of Firebase notification
 * this is the data received from the server
 * @type {NotificationType} type of notification
 * @go_to {string} property used to match the name of the view to navigate
 * @view_data {any} data to be sent to the view
 * @staticPropExample {string} TODO:// this is an example
 */
interface FirebaseResponseData {
  type: NotificationType;
  go_to?: ViewName;
  view_data?: any;
  staticPropExample?: any; // This is just an example, you can add more properties
}

/**
 * Object containing data from the notification + parsed data
 * This object may contain new properties depending on the type of notification
 *
 * @type {NotificationType} type of notification
 * @goTo {NavigationViewName} name of the view to navigate
 * @view_data {any} data to be sent to the view
 * @staticProp {string} TODO:// this is an example
 * @navigationRef {React.RefObject} navigation reference
 */
interface ParsedObject {
  type: NotificationType;
  goTo?: NavigationViewName;
  viewData?: any;
  staticProp?: string;
  navigationRef?: any;
}

declare global {
  var notificationData: ParsedObject | null;
}
