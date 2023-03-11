import React, { useState, useEffect, useRef } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNetInfo } from '@react-native-community/netinfo';
import crashlytics from '@react-native-firebase/crashlytics';
import { SafeAreaView, StatusBar } from 'react-native';
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
} from '@/Containers';
import { userApi } from '@/Services/modules/users';
import { store } from '@/Store';
import { setUser as storeUser } from '@/Store/User';
import { useTheme, useUser } from '@/Hooks';
import { TENDENCY } from '@/Containers/HomeContainer/Table';
import MainNavigator from './Main';
import { NfcPromptAndroid } from '@/Components';
import { Colors } from '@/Theme/Variables';

export type NavigatorParams = {
  Main: undefined;
  Home: { refetch: string | null; sensorLife?: number; tendency?: TENDENCY };
  Add: undefined;
  History: undefined;
  Profile: { section?: string } | undefined;
  SignIn: undefined;
  SignUp: undefined;
  NoNetwork: undefined;
  Onboarding: undefined;
  WithoutPremium: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<NavigatorParams>();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const netInfo = useNetInfo();
  const { on_boarding: savedOnobarding } = useUser();
  const [skip, setSkip] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | undefined
  >();
  const {
    data = null,
    error,
    refetch,
    isFetching,
  } = userApi.useFetchUserQuery(user?.uid, {
    skip,
    refetchOnMountOrArgChange: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<NavigatorParams>>(null);

  const { colors } = NavigationTheme;
  const onAuthStateChanged = async (sUser: FirebaseAuthTypes.User | null) => {
    if (sUser) {
      await crashlytics().setUserId(sUser.uid);
    }

    setUser(sUser);
  };

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      if (!netInfo.isConnected) {
        navigationRef.current?.navigate('NoNetwork');
      }
    }
  }, [netInfo, navigationRef.current]);

  useEffect(() => {
    if (user) {
      setSkip(false);
      refetch();
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
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
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
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
