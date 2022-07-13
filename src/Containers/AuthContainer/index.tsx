import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Incubator, Text } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import { FormButton } from '@/Components';
import AuthService from '@/Services/modules/auth';
import { styles, colors } from './styles';

const { Toast, TextField } = Incubator;

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
        placeholder="Contraseña"
        onChangeText={(value: string) => setPassword(value)}
        enableErrors
        validate={['required', (value: string) => value.length > 6]}
        validationMessage={['Field is required', 'Password is too short']}
        maxLength={30}
        secureTextEntry
      />
      <Text style={styles.text}>¿Olvidaste tu contraseña?</Text>
      <FormButton
        label="Iniciar sesión"
        disabledCondition={error || !email || !password}
        onPress={handleLogin}
        backgroundColor={colors.black}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.divider} />
        <Text style={styles.dividerLetter}>O</Text>
        <Text style={styles.divider} />
      </View>
      <View style={styles.googleButton}>
        <FormButton
          label="Iniciar sesión con Google"
          onPress={handleGoogleLogIn}
          backgroundColor={colors.red}
        />
      </View>
      <Text
        style={styles.textBottom}
        highlightString="Registrate"
        highlightStyle={styles.highlight}
      >
        ¿No tenés cuenta? Registrate
      </Text>
    </View>
  );
};

export default AuthContainer;
