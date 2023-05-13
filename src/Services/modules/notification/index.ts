import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

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

  handleMessageReceived = async (message: any, type: NotificationState) => {
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
      title: message.notification.title,
      body: message.notification.body,
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

  handleBackgroundEvent = async (message: any, notificationId: string) => {
    console.log('Background notification message:', message);
    // Remove the notification
    await notifee.cancelNotification(notificationId);
  };

  handleQuitEvent = async (remoteMessage: any) => {
    console.log('Message handled in quit state!', remoteMessage);
    // TODO: Logic to store the message in the storage for later use
  };
};

export default new Notification();
