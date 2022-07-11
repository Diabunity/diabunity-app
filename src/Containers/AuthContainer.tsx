import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/Hooks';
import { Button, Incubator, Text } from 'react-native-ui-lib';
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
        style={styles.textField}
        placeholder="Email"
        onChangeText={(value: string) => setEmail(value)}
        enableErrors
        validate={['required', 'email', (value: string) => value.length > 6]}
        validationMessage={[
          'Field is required',
          'Email is invalid',
          'Password is too short',
        ]}
        maxLength={30}
      />
      <TextField
        style={styles.textField}
        placeholder="Password"
        onChangeText={(value: string) => setPassword(value)}
        enableErrors
        validate={['required', (value: string) => value.length > 6]}
        validationMessage={['Field is required', 'Password is too short']}
        maxLength={30}
        secureTextEntry
      />
      <Text style={styles.text}>¿Olvidaste tu contraseña?</Text>
      <Button
        label={'Iniciar sesión'.toUpperCase()}
        disabled={error || !email || !password}
        onPress={handleLogin}
        backgroundColor="#000000"
        color="#fff"
        borderRadius={4}
        labelStyle={styles.button}
      />
      <Button
        label={'Iniciar sesión con Google'.toUpperCase()}
        onPress={handleGoogleLogIn}
        backgroundColor="#C1272D"
        color="#fff"
        borderRadius={4}
        labelStyle={styles.button}
      />
      <Text
        style={styles.text}
        highlightString="Registrate"
        highlightStyle={styles.highlight}
      >
        ¿No tenes cuenta? Registrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textField: {
    width: 277,
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.42)',
  },
  text: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    letterSpacing: 1.25,
  },
  highlight: {
    color: '#C1272D',
    fontWeight: '700',
  },
});

export default AuthContainer;
