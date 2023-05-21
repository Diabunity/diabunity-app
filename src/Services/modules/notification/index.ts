import { VIEW_NAMES } from '@/Constants/views';
import { FirebaseResponseData, ParsedObject } from '@/index';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

const handleNotification = (notificationData: ParsedObject) => {
  const { type } = notificationData;

  if (type === 'navigate') {
    const { goTo, navigationRef } = notificationData;
    const hasValidGoTo = goTo ? Object.keys(VIEW_NAMES).includes(goTo) : null;

    if (hasValidGoTo) {
      const viewName = VIEW_NAMES[goTo as keyof typeof VIEW_NAMES];

      // TODO: send data to view
      // const viewData = notificationData.viewData;
      navigationRef.current?.navigate(viewName);
    }
  }
};

const parseResponse = (response: FirebaseResponseData): ParsedObject | null => {
  const type = response.type;

  if (type === 'navigate') {
    if (response.go_to) {
      const { go_to: goTo } = response;

      return {
        type,
        goTo,
      };
    }
  } else if (type === 'static') {
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

export enum NotificationState {
  FOREGROUND = 'foreground',
  BACKGROUND = 'background',
  QUIT = 'quit',
}

const Notification = class Notification {
  CHANNEL_OPTIONS = {
    id: 'diabunity_channel',
    name: 'Diabunity Channel',
    importance: AndroidImportance.DEFAULT,
  };

  handleMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
    type: NotificationState
  ) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      ...this.CHANNEL_OPTIONS,
      importance:
        type === NotificationState.FOREGROUND
          ? AndroidImportance.HIGH
          : this.CHANNEL_OPTIONS.importance,
    });

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      android: {
        channelId,
      },
    });

    if (type === NotificationState.BACKGROUND) {
      await this.handleBackgroundEvent(message, notificationId);
    }
  };

  handleForegroundEvent = () => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  };

  handleBackgroundEvent = async (
    message: FirebaseMessagingTypes.RemoteMessage,
    notificationId: string
  ) => {
    console.log('Background notification message:', message);
    // Remove the notification
    await notifee.cancelNotification(notificationId);
  };

  handleQuitEvent = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    console.log('Message handled in quit state!', remoteMessage);
    global.notificationData = parseResponse(
      remoteMessage.data as unknown as FirebaseResponseData
    );
  };

  checkForNotification = (navigationRef: any) => {
    const { notificationData } = global;
    if (notificationData) {
      notificationData.navigationRef = navigationRef;
      handleNotification(notificationData);
    }

    global.notificationData = null;
  };
};

export default new Notification();
