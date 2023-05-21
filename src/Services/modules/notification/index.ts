import { VIEW_NAMES } from '@/Constants/views';
import { NotificationType, FirebaseResponseData, ParsedObject } from '@/index';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

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
