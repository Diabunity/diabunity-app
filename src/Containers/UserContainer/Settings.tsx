import React from 'react';
import { Text } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { useTheme } from '@/Hooks';

const Settings = () => {
  const { Layout } = useTheme();
  return (
    <ScrollView
      contentContainerStyle={[Layout.colCenter, { paddingBottom: 100 }]}
    >
      <Text>Settings</Text>
    </ScrollView>
  );
};

export default Settings;
