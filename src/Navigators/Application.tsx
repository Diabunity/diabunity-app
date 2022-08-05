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

export type NavigatorParams = {
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<NavigatorParams>();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const [skip, setSkip] = useState<boolean>(true);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const { data, isFetching } = userApi.useFetchUserQuery(user?.uid, { skip });
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = NavigationTheme;

  const onAuthStateChanged = (sUser: FirebaseAuthTypes.User | null) => {
    setUser(sUser);
    if (sUser) {
      setSkip(false);
    } else {
      setIsOnboarded(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!isFetching) {
      setIsOnboarded(!!data?.on_boarding);
      setSkip(true);
      setIsLoading(false);
    }
  }, [isFetching]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (isLoading) {
    return <StartupContainer />;
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              {!isOnboarded && (
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
