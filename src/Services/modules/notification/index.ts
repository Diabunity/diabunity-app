import notifee, {
  AndroidImportance,
  EventDetail,
  EventType,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import { VIEW_NAMES } from '@/Constants/views';
import { Colors } from '@/Theme/Variables';
import {
  NotificationType,
  FirebaseResponseData,
  ParsedObject,
} from '@/index.d';

export enum NotificationState {
  FOREGROUND = 'foreground',
  BACKGROUND = 'background',
  QUIT = 'quit',
}

const handleNotification = (notificationData: ParsedObject) => {
  const { type } = notificationData;
  if (NotificationType.NAVIGATE === type) {
    const { goTo, viewData, navigationRef } = notificationData;
    navigationRef.current?.navigate(goTo, viewData);
  }
};

const parseResponse = (response: FirebaseResponseData): ParsedObject | null => {
  const type = response.type;

  if (NotificationType.NAVIGATE === type) {
    if (response.go_to) {
      const { go_to: goTo, view_data: viewData } = response;

      const hasValidGoTo = goTo && Object.keys(VIEW_NAMES).includes(goTo);
      if (!hasValidGoTo) {
        return null;
      }

      return {
        type,
        viewData: JSON.parse(viewData),
        goTo: VIEW_NAMES[goTo as keyof typeof VIEW_NAMES],
      };
    }
  } else if (NotificationType.STATIC === type) {
    if (response.staticPropExample) {
      const { staticPropExample } = response;

      return {
        type,
        staticProp: staticPropExample,
      };
    }
  }

  return null; // Return null if the type is unknown or properties are missing
};

const Notification = class Notification {
  CHANNEL_OPTIONS = {
    id: 'diabunity_channel',
    name: 'Diabunity Channel',
    importance: AndroidImportance.HIGH,
    lights: true,
    vibration: true,
    lightColor: Colors.red,
  };

  navigationRef: any = null;
  channelId: string | undefined = undefined;

  constructor() {
    // Create a channel (required for Android)
    notifee
      .createChannel({
        ...this.CHANNEL_OPTIONS,
      })
      .then((channelId) => (this.channelId = channelId));
  }

  handleMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
    type: NotificationState,
    navigator: any
  ) => {
    if (!this.navigationRef) {
      this.navigationRef = navigator;
    }
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title: `<b>${message?.notification?.title}<b>`,
      body: message?.notification?.body,
      android: {
        channelId: this.channelId,
        smallIcon: 'ic_small_icon',
        color: Colors.red,
        lightUpScreen: true,
        timestamp: Date.now(),
        showTimestamp: true,
      },
    });

    if (type === NotificationState.BACKGROUND) {
      await this.handleBackgroundEvent(message, notificationId);
    }
  };

  handleForegroundEvent = () => {
    return notifee.onForegroundEvent(
      ({ type, detail }: { type: EventType; detail: EventDetail }) => {
        switch (type) {
          case EventType.DISMISSED:
            analytics().logEvent('notification_dismissed', {
              ...detail.notification,
            });
            break;
          case EventType.PRESS:
            analytics().logEvent('notification_pressed', {
              ...detail.notification,
            });
            const notificationData = parseResponse(
              detail.notification?.data as unknown as FirebaseResponseData
            );
            if (notificationData) {
              handleNotification({
                ...notificationData,
                navigationRef: this.navigationRef,
              });
            }
            break;
        }
      }
    );
  };

  handleBackgroundEvent = async (
    message: FirebaseMessagingTypes.RemoteMessage,
    notificationId: string
  ) => {
    const notificationData = parseResponse(
      message.data as unknown as FirebaseResponseData
    );
    if (notificationData) {
      handleNotification({
        ...notificationData,
        navigationRef: this.navigationRef,
      });
    }
    await notifee.cancelNotification(notificationId);
  };

  handleQuitEvent = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    global.notificationData = parseResponse(
      remoteMessage.data as unknown as FirebaseResponseData
    );
  };

  checkForNotification = (navigationRef: any) => {
    const { notificationData } = global;
    if (!this.navigationRef) {
      this.navigationRef = navigationRef;
    }
    if (notificationData) {
      notificationData.navigationRef = this.navigationRef;
      handleNotification(notificationData);
    }

    global.notificationData = null;
  };
};

export default new Notification();
