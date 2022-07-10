import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@/Hooks';
import { Button, Incubator } from 'react-native-ui-lib';
import AuthService from '@/Services/modules/auth';

const { Toast, TextField } = Incubator;

const AuthContainer = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<boolean>(false);
  const { Layout, Images } = useTheme();

  const handleGoogleLogIn = async () => {
    try {
      await AuthService.signInWithGoogle();
    } catch {
      setError(true);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      return;
    }
    try {
      await AuthService.signInWithEmailAndPassword(email, password);
    } catch (e) {
      setError(true);
    }
  };

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Image style={Layout.size} source={Images.logo} />
      <Toast
        visible={error}
        position="top"
        autoDismiss={3000}
        message="There was an error logging in"
        preset={Incubator.ToastPresets.FAILURE}
        onDismiss={() => setError(false)}
      />
      <TextField
        placeholder="Email"
        floatingPlaceholder
        onChangeText={(value: string) => setEmail(value)}
        enableErrors
        validate={['required', 'email', (value: string) => value.length > 6]}
        validationMessage={[
          'Field is required',
          'Email is invalid',
          'Password is too short',
        ]}
        showCharCounter
        maxLength={30}
      />
      <TextField
        placeholder="Password"
        floatingPlaceholder
        onChangeText={(value: string) => setPassword(value)}
        enableErrors
        validate={['required', (value: string) => value.length > 6]}
        validationMessage={['Field is required', 'Password is too short']}
        showCharCounter
        maxLength={30}
        secureTextEntry
      />
      <Button
        label="Login"
        disabled={error || !email || !password}
        onPress={handleLogin}
      />
      <Button
        label="Google Sign-In"
        onPress={handleGoogleLogIn}
        backgroundColor="red"
      />
    </View>
  );
};

export default AuthContainer;
