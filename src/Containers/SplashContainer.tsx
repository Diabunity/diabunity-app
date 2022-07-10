import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/Hooks';
import { Brand } from '@/Components';
import { setDefaultTheme } from '@/Store/Theme';

const SplashContainer = () => {
  const { Layout } = useTheme();

  const init = () => {
    setDefaultTheme({ theme: 'default', darkMode: false });
  };

  useEffect(() => {
    init();
  });

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
    </View>
  );
};

export default SplashContainer;
