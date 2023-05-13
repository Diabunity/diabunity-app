import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';
import Notification from '@/Services/modules/notification';

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

messaging().setBackgroundMessageHandler(Notification.handleQuitEvent);

AppRegistry.registerComponent(appName, () => HeadlessCheck);
