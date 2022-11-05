import React, { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  StartupContainer,
  AuthContainer,
  ForgotPasswordContainer,
  OnboardingContainer,
} from '@/Containers';
import { userApi } from '@/Services/modules/users';
import { useTheme } from '@/Hooks';
import MainNavigator from './Main';
import { navigationRef } from './utils';
import { NfcPromptAndroid } from '@/Components';

import messaging from '@react-native-firebase/messaging';

export type NavigatorParams = {
  Main: undefined;
  Home: { refetch: string | null; sensorLife?: number };
  Add: undefined;
  Profile: { section?: string } | undefined;
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<NavigatorParams>();

async function onMessageReceived(message: any) {
  console.log('Message goes here');
  console.log(message);
  console.log('Message ends here');

  return Promise.resolve();
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const [skip, setSkip] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | undefined
  >();
  const {
    data = null,
    error,
    refetch,
  } = userApi.useFetchUserQuery(user?.uid, {
    skip,
    refetchOnMountOrArgChange: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = NavigationTheme;

  const onAuthStateChanged = (sUser: FirebaseAuthTypes.User | null) =>
    setUser(sUser);

  useEffect(() => {
    if (user) {
      setSkip(false);
    } else {
      if (user === null) {
        setIsLoading(false);
      }
    }
    setHasCompletedOnboarding(undefined);
    refetch();
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    if (data && !error) {
      setHasCompletedOnboarding(!!data?.on_boarding);
      setSkip(true);
      setIsLoading(false);
    } else {
      if (error) {
        setIsLoading(false);
        setHasCompletedOnboarding(false);
      }
    }
  }, [data, error]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    async function onAppBoost() {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('Token for current device', token);

      // post data into our server
    }

    onAppBoost();
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
      console.log('Data: ', remoteMessage.data);
      //navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
          console.log('Data: ', remoteMessage.data);
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
  }, []);

  if (
    isLoading ||
    (hasCompletedOnboarding === undefined && user !== null) || //We use null and undefined to differentiate between initial state and api response
    user === undefined
  ) {
    return <StartupContainer />;
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              {hasCompletedOnboarding === false && (
                <Stack.Screen
                  name="Onboarding"
                  component={OnboardingContainer}
                />
              )}
              <Stack.Screen name="Main" component={MainNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={AuthContainer} />
              <Stack.Screen name="SignUp" component={AuthContainer} />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordContainer}
              />
            </>
          )}
        </Stack.Navigator>
        <NfcPromptAndroid />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
