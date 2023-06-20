import React, { useState, useEffect, useRef } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNetInfo } from '@react-native-community/netinfo';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import {
  StartupContainer,
  AuthContainer,
  ForgotPasswordContainer,
  OnboardingContainer,
  WithoutPremiumContainer,
  NoNetworkContainer,
  MedicalReportContainer,
  FeedbackContainer,
} from '@/Containers';
import { DeviceData, userApi } from '@/Services/modules/users';
import { store } from '@/Store';
import { setUser as storeUser } from '@/Store/User';
import { useTheme, useUser } from '@/Hooks';
import { TENDENCY } from '@/Containers/HomeContainer/Table';
import MainNavigator from './Main';
import { Feedback, NfcPromptAndroid } from '@/Components';
import { Colors } from '@/Theme/Variables';
import DeviceInfo from 'react-native-device-info';
import analytics from '@react-native-firebase/analytics';

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
    skip,
    refetchOnMountOrArgChange: true,
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
      } catch (error) {
        analytics().logEvent('error_registering_device', { error });
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
      if (error) {
        setIsLoading(false);
        setHasCompletedOnboarding(false);
      }
    }
  }, [data, error, isFetching]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
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
      <NavigationContainer
        theme={NavigationTheme}
        ref={navigationRef}
        onStateChange={handleStateChange}
      >
        <StatusBar
          backgroundColor={Colors.red}
          barStyle={darkMode ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              {hasCompletedOnboarding === false && !savedOnobarding && (
                <Stack.Screen
                  name="Onboarding"
                  component={OnboardingContainer}
                />
              )}
              <Stack.Screen name="Main" component={MainNavigator} />
              <Stack.Screen
                name="WithoutPremium"
                component={WithoutPremiumContainer}
              />
              <Stack.Screen
                name="MedicalReport"
                component={MedicalReportContainer}
              />
              <Stack.Screen name="Feedback" component={FeedbackContainer} />
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
          <Stack.Screen name="NoNetwork" component={NoNetworkContainer} />
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
