import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { View } from 'react-native';
import { useTheme } from '@/Hooks';
import { navigate } from '@/Navigators/utils';
import { Button, Incubator } from 'react-native-ui-lib';

const { Toast, TextField } = Incubator;

const LoginContainer = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<boolean>(false);
  const { Layout } = useTheme();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      return;
    }
    try {
      const loggedInUser = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      if (loggedInUser) {
        navigate('Main', { screen: 'Home' });
      }
    } catch (e) {
      setError(true);
    }
  };

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Toast
        visible={error}
        position={'top'}
        autoDismiss={5000}
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
    </View>
  );
};

export default LoginContainer;
