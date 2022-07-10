import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import AuthService from '@/Services/modules/auth';

const UserContainer = () => {
  const user = AuthService.getCurrentUser();
  const { Layout, Fonts } = useTheme();

  const handleLogOut = async () => {
    await AuthService.signOut();
  };

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      {user && <Text style={Fonts.textRegular}>Hola, {user.displayName}!</Text>}
      <Button label="Sign out" onPress={handleLogOut} />
    </View>
  );
};

export default UserContainer;
