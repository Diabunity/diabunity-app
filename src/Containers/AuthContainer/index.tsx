import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Incubator, Text } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import { BackButton, FormButton } from '@/Components';
import AuthService from '@/Services/modules/auth';
import { styles, colors } from './styles';

import type { NavigatorParams } from '../../Navigators/Application';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const { Toast, TextField } = Incubator;

type Props = NativeStackScreenProps<NavigatorParams, 'SignIn' | 'SignUp'>;

const AuthContainer = ({
  route,
  navigation: { navigate, goBack, canGoBack },
}: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const { Layout, Images } = useTheme();

  const isSignUp = route.name === 'SignUp';

  const handleGoogleButton = async (): Promise<void> => {
    try {
      await AuthService.signInWithGoogle();
    } catch {
      setError(true);
    }
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      await AuthService.signInWithEmailAndPassword(email, password);
    } catch (e) {
      setError(true);
    }
  };

  const handleSignUp = async (): Promise<void> => {
    try {
      const { user } = (await AuthService.signUpWithEmailAndPassword(
        email,
        password
      )) as FirebaseAuthTypes.UserCredential;
      await user.updateProfile({
        displayName: name,
      });
    } catch (e) {
      setError(true);
    }
  };

  return (
    <>
      <BackButton goBack={goBack} canGoBack={canGoBack} />
      <View style={[Layout.fill, Layout.colCenter]}>
        <Image style={Layout.size} source={Images.logo} />
        <Toast
          visible={error}
          position="top"
          autoDismiss={3000}
          message={`Ups, hubo un problema al ${
            isSignUp ? 'registrarse' : 'iniciar sesión'
          }`}
          preset={Incubator.ToastPresets.FAILURE}
          onDismiss={() => setError(false)}
        />
        {isSignUp && (
          <TextField
            style={styles.textField}
            placeholder="Nombre"
            onChangeText={(value: string) => setName(value)}
            enableErrors
            migrate
            validate={['required', (value: string) => value.length > 3]}
            validationMessage={[
              'Este campo es requerido',
              'El texto debe ser mayor a 3 caracteres',
            ]}
            validateOnChange
            maxLength={30}
          />
        )}
        <TextField
          style={styles.textField}
          placeholder="Email"
          onChangeText={(value: string) => setEmail(value)}
          enableErrors
          migrate
          validate={['required', 'email']}
          validateOnChange
          validationMessage={[
            'Este campo es requerido',
            'El email es inválido',
          ]}
          maxLength={30}
        />
        <TextField
          style={styles.textField}
          placeholder="Contraseña"
          onChangeText={(value: string) => setPassword(value)}
          enableErrors
          migrate
          validate={['required', (value: string) => value.length > 6]}
          validationMessage={[
            'Este campo es requerido',
            'La contraseña es muy corta',
          ]}
          maxLength={30}
          secureTextEntry
          validateOnChange
        />
        {isSignUp && (
          <TextField
            style={styles.textField}
            placeholder="Repetir contraseña"
            onChangeText={(value: string) => setRepeatedPassword(value)}
            enableErrors
            migrate
            validate={[
              'required',
              (value: string) => value.length > 6,
              (value: string) => value === password,
            ]}
            validationMessage={[
              'Este campo es requerido',
              'La contraseña es muy corta',
              'Las contraseñas no coinciden',
            ]}
            maxLength={30}
            secureTextEntry
            validateOnChange
          />
        )}
        {!isSignUp && (
          <Text style={styles.text}>¿Olvidaste tu contraseña?</Text>
        )}
        <FormButton
          label={isSignUp ? 'Registrarse' : 'Iniciar sesión'}
          disabledCondition={
            error ||
            !email ||
            !password ||
            (isSignUp ? !name || !repeatedPassword : false)
          }
          onPress={isSignUp ? handleSignUp : handleSignIn}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.divider} />
          <Text style={styles.dividerLetter}>O</Text>
          <Text style={styles.divider} />
        </View>
        <View style={styles.googleButton}>
          <FormButton
            label={
              isSignUp ? 'Registrarse con Google' : 'Iniciar sesión con Google'
            }
            onPress={handleGoogleButton}
            backgroundColor={colors.red}
          />
        </View>
        {!isSignUp && (
          <Text
            style={styles.textBottom}
            highlightString="Registrate"
            highlightStyle={styles.highlight}
            onPress={() => navigate('SignUp')}
          >
            ¿No tenés cuenta? Registrate
          </Text>
        )}
      </View>
    </>
  );
};

export default AuthContainer;
