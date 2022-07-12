import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/Hooks';
import { Button, Incubator, Text } from 'react-native-ui-lib';
import AuthService from '@/Services/modules/auth';

const { Toast, TextField } = Incubator;

interface FormButtonProps {
  label: string;
  disabledCondition?: boolean;
  onPress: () => void;
  backgroundColor: string;
};

const FormButton = ({ label, disabledCondition, onPress, backgroundColor }: FormButtonProps) => (
  <Button
    label={label.toUpperCase()}
    disabled={disabledCondition ?? false}
    onPress={onPress}
    backgroundColor={backgroundColor}
    color="#fff"
    borderRadius={4}
    labelStyle={styles.button}
    marginT-20
    marginB-20
  />
);

const AuthContainer = () => {
  const [isLoginFlow, setIsLoginFlow] = useState(true); // TODO: Use this to switch between login and signup
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
      <FormButton
        label='Iniciar sesión'
        disabledCondition={error || !email || !password}
        onPress={handleLogin}
        backgroundColor="#000"
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.divider} />
        <Text>O</Text>
        <Text style={styles.divider} />
      </View>
      <FormButton
        label='Iniciar sesión con Google'
        onPress={handleGoogleLogIn}
        backgroundColor="#C1272D"
      />
      <Text
        style={styles.textBottom}
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
  textBottom: {
    color: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
  },
  button: {
    letterSpacing: 1.25,
  },
  divider: {
    width: 137,
    height: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 22,
  },
  highlight: {
    color: '#C1272D',
    fontWeight: '700',
  },
});

export default AuthContainer;
