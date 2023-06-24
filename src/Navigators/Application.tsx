import { Feedback, NfcPromptAndroid } from '@/Components';
import { TOAST_TIMEOUT } from '@/Constants';
import { VIEW_NAMES } from '@/Constants/views';
import {
  AuthContainer,
  FeedbackContainer,
  ForgotPasswordContainer,
  MedicalReportContainer,
  NoNetworkContainer,
  OnboardingContainer,
  StartupContainer,
  WithoutPremiumContainer,
} from '@/Containers';
import { TENDENCY } from '@/Containers/HomeContainer/Table';
import { useNotification, useTheme, useUser } from '@/Hooks';
import Notification, {
  NotificationState,
} from '@/Services/modules/notification';
import { DeviceData, userApi } from '@/Services/modules/users';
import { store } from '@/Store';
import { toggleNotification } from '@/Store/Notification';
import { setUser as storeUser } from '@/Store/User';
import { Colors } from '@/Theme/Variables';
import { useNetInfo } from '@react-native-community/netinfo';
import analytics from '@react-native-firebase/analytics';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Toast } from 'react-native-ui-lib';
import MainNavigator from './Main';

export type NavigatorParams = {
  Main: undefined;
  Home: { refetch: string | null; sensorLife?: number; tendency?: TENDENCY };
  Add: undefined;
  History: undefined;
  Profile: { section?: string } | undefined;
  SignIn: undefined;
  SignUp: undefined;
  NoNetwork: undefined;
  Feedback: undefined;
  Onboarding: undefined;
  WithoutPremium: undefined;
  MedicalReport: { filter: string };
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<NavigatorParams>();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const netInfo = useNetInfo();
  const { visible, message, color, preset } = useNotification();
  const { on_boarding: savedOnobarding } = useUser();
  const [skip, setSkip] = useState<boolean>(true);
  const [navigationChanged, setNavigationChanged] = useState<string>();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | undefined
  >();
  const {
    data = null,
    error,
    isFetching,
  } = userApi.useFetchUserQuery(user?.uid, {
    skip: skip || !user,
    refetchOnMountOrArgChange: !!user,
  });
  const [saveDeviceData] = userApi.useSaveDeviceDataMutation();
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<NavigatorParams>>(null);

  const { colors } = NavigationTheme;
  const onAuthStateChanged = async (sUser: FirebaseAuthTypes.User | null) => {
    if (sUser) {
      await crashlytics().setUserId(sUser.uid);
    }

    setUser(sUser);
  };

  const handleStateChange = () => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    setNavigationChanged(currentRouteName);
  };

  useEffect(() => {
    // Foreground Notifications
    messaging().onMessage((remoteMessage) =>
      Notification.handleMessageReceived(
        remoteMessage,
        NotificationState.FOREGROUND,
        navigationRef
      )
    );
    // Background Notifications
    messaging().setBackgroundMessageHandler((remoteMessage) =>
      Notification.handleMessageReceived(
        remoteMessage,
        NotificationState.BACKGROUND,
        navigationRef
      )
    );

    return Notification.handleForegroundEvent();
  }, []);

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      if (!netInfo.isConnected) {
        navigationRef.current?.navigate('NoNetwork');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netInfo, navigationRef.current]);

  useEffect(() => {
    if (user) {
      setSkip(false);
    } else {
      if (user === null) {
        setIsLoading(false);
      }
    }
    setHasCompletedOnboarding(undefined);
  }, [user]);

  useEffect(() => {
    // If the user is not yet authenticated, do not register the device ID
    if (!user) {
      return;
    }

    async function registerDevice() {
      try {
        // Request permission to access FCM token on Android
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          analytics().logEvent('error_FCM_permission_denied');
          return;
        }

        // Get the FCM token and device ID
        const token = await messaging().getToken();
        const deviceBody: DeviceData = {
          deviceId: token,
          osVersion: DeviceInfo.getSystemVersion(),
          brand: DeviceInfo.getBrand(),
        };

        await saveDeviceData(deviceBody);
      } catch (err) {
        analytics().logEvent('error_registering_device', { err });
      }
    }

    if (Platform.OS === 'android') {
      registerDevice();
    }
  }, [saveDeviceData, user]);

  useEffect(() => {
    setIsLoading(true);
    if (data && !error && !isFetching) {
      store.dispatch(storeUser(data));
      setHasCompletedOnboarding(!!data?.on_boarding);
      setSkip(true);
      setIsLoading(false);
    } else {
      if (error && !error.code.includes('auth/no-current-user')) {
        setIsLoading(false);
        setHasCompletedOnboarding(false);
      }
    }
  }, [data, error, isFetching]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Notification.checkForNotification(navigationRef);
    }
  }, [isLoading]);

  if (
    isLoading ||
    (hasCompletedOnboarding === undefined && user !== null) || //We use null and undefined to differentiate between initial state and api response
    user === undefined
  ) {
    return <StartupContainer />;
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer
        theme={NavigationTheme}
        ref={navigationRef}
        onStateChange={handleStateChange}
      >
        <StatusBar
          backgroundColor={Colors.red}
          barStyle={darkMode ? 'light-content' : 'dark-content'}
        />
        <View>
          <Toast
            visible={visible}
            autoDismiss={TOAST_TIMEOUT}
            position="top"
            backgroundColor={color}
            message={message}
            preset={preset}
            onDismiss={() =>
              store.dispatch(toggleNotification({ visible: false }))
            }
          />
        </View>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              {hasCompletedOnboarding === false && !savedOnobarding && (
                <Stack.Screen
                  name={VIEW_NAMES.ONBOARDING}
                  component={OnboardingContainer}
                />
              )}
              <Stack.Screen name={VIEW_NAMES.MAIN} component={MainNavigator} />
              <Stack.Screen
                name={VIEW_NAMES.WITHOUT_PREMIUM}
                component={WithoutPremiumContainer}
              />
              <Stack.Screen
                name={VIEW_NAMES.MEDICAL_REPORT}
                component={MedicalReportContainer}
              />
              <Stack.Screen name="Feedback" component={FeedbackContainer} />
            </>
          ) : (
            <>
              <Stack.Screen
                name={VIEW_NAMES.SIGN_IN}
                component={AuthContainer}
              />
              <Stack.Screen
                name={VIEW_NAMES.SIGN_UP}
                component={AuthContainer}
              />
              <Stack.Screen
                name={VIEW_NAMES.FORGOT_PASSWORD}
                component={ForgotPasswordContainer}
              />
            </>
          )}
          <Stack.Screen
            name={VIEW_NAMES.NO_NETWORK}
            component={NoNetworkContainer}
          />
        </Stack.Navigator>
        <NfcPromptAndroid />
        <Feedback
          navigationRef={navigationRef}
          currentRoute={navigationChanged}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
