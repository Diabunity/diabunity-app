import React, { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StartupContainer, AuthContainer } from '@/Containers';
import { useTheme } from '@/Hooks';
import MainNavigator from './Main';
import { navigationRef } from './utils';
import { NfcPromptAndroid } from '@/Components';

const Stack = createStackNavigator();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = NavigationTheme;

  const onAuthStateChanged = (sUser: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged', sUser);
    setUser(sUser);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (isLoading) {
    return <StartupContainer />;
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          ) : (
            <Stack.Screen
              name="Auth"
              component={AuthContainer}
              options={{
                animationEnabled: false,
              }}
            />
          )}
        </Stack.Navigator>
        <NfcPromptAndroid />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
