import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';
import { Brand } from '@/Components';
import { setDefaultTheme } from '@/Store/Theme';
import { navigate } from '@/Navigators/utils';

const StartupContainer = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const { Layout, Gutters, Fonts } = useTheme();

  const { t } = useTranslation();

  const onAuthStateChanged = (user: any) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
    init();
  };

  const init = async () => {
    if (initializing) {
      return null;
    }
    if (!user) {
      navigate('Main', { screen: 'Login' });
    } else {
      navigate('Main', { screen: 'Home' });
    }

    setDefaultTheme({ theme: 'default', darkMode: false });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      <Text style={Fonts.textCenter}>{t('welcome')}</Text>
    </View>
  );
};

export default StartupContainer;
