import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';
import { Brand } from '@/Components';
import { setDefaultTheme } from '@/Store/Theme';

const StartupContainer = () => {
  const { Layout, Gutters, Fonts } = useTheme();

  const { t } = useTranslation();

  const init = () => {
    setDefaultTheme({ theme: 'default', darkMode: false });
  };

  useEffect(() => {
    init();
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
