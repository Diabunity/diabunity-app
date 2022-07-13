import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@/Hooks';
import { Incubator, Text } from 'react-native-ui-lib';
import { FormButton } from '@/Components';
import AuthService from '@/Services/modules/auth';
import { styles, colors } from './styles';

const { Toast, TextField } = Incubator;

const SignInContainer = ({ navigation: { navigate } }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const { Layout, Images } = useTheme();

  const handleGoogleLogIn = async (): Promise<void> => {
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
        message="Ups, hubo un problema al iniciar sesión"
        preset={Incubator.ToastPresets.FAILURE}
        onDismiss={() => setError(false)}
      />
      <TextField
        style={styles.textField}
        placeholder="Email"
        onChangeText={(value: string) => setEmail(value)}
        enableErrors
        validate={['required', 'email']}
        validationMessage={['Este campo es requerido', 'El email es inválido']}
        maxLength={30}
      />
      <TextField
        style={styles.textField}
        placeholder="Contraseña"
        onChangeText={(value: string) => setPassword(value)}
        enableErrors
        validate={['required', (value: string) => value.length > 6]}
        validationMessage={[
          'Este campo es requerido',
          'La contraseña es muy corta',
        ]}
        maxLength={30}
        secureTextEntry
        validateOnChange
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
        <Text>O</Text>
        <Text style={styles.divider} />
      </View>
      <FormButton
        label="Iniciar sesión con Google"
        onPress={handleGoogleLogIn}
        backgroundColor={colors.red}
      />
      <Text
        style={styles.textBottom}
        highlightString="Registrate"
        highlightStyle={styles.highlight}
        onPress={() => navigate('SignUp')}
      >
        ¿No tenes cuenta? Registrate
      </Text>
    </View>
  );
};

export default SignInContainer;
