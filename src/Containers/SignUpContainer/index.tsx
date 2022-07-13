import React, { useState, createRef } from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@/Hooks';
import { Incubator, Text } from 'react-native-ui-lib';
import { FormButton } from '@/Components';
import AuthService from '@/Services/modules/auth';
import { styles, colors } from './styles';

const { Toast, TextField } = Incubator;

const SignUpContainer = () => {
  const { Layout, Images } = useTheme();
  const [error, setError] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = useState<string>('');

  const refs = Array(4)
    .fill(null)
    .map(() => createRef<any>());

  const isFormValid = (): boolean => {
    for (let i = 0; i < refs.length; i++) {
      if (!refs[i].current.validate()) {
        return false;
      }
    }

    return true;
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      await AuthService.signInWithGoogle();
    } catch {
      setError(true);
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (isFormValid()) {
      try {
        await AuthService.signUpWithEmailAndPassword(name, email, password);
      } catch (e) {
        setError(true);
      }
    }
  };

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Image style={Layout.size} source={Images.logo} />
      <Toast
        visible={error}
        position="top"
        autoDismiss={3000}
        message="Ups, hubo un problema al registrarte"
        preset={Incubator.ToastPresets.FAILURE}
        onDismiss={() => setError(false)}
      />
      <TextField
        style={styles.textField}
        ref={refs[0]}
        placeholder="Nombre"
        onChangeText={(value: string) => setName(value)}
        enableErrors
        validate={['required', (value: string) => value.length > 3]}
        validationMessage={[
          'Este campo es requerido',
          'El texto debe ser mayor a 3 caracteres',
        ]}
        validateOnChange
        maxLength={30}
      />
      <TextField
        style={styles.textField}
        ref={refs[1]}
        placeholder="Email"
        onChangeText={(value: string) => setEmail(value)}
        enableErrors
        validate={['required', 'email']}
        validateOnChange
        validationMessage={['Este campo es requerido', 'El email es inválido']}
        maxLength={30}
      />
      <TextField
        style={styles.textField}
        ref={refs[2]}
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
      <TextField
        style={styles.textField}
        ref={refs[3]}
        placeholder="Repetir contraseña"
        onChangeText={(value: string) => setRepeatedPassword(value)}
        enableErrors
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
      <FormButton
        label="Registrarse"
        onPress={handleSignUp}
        disabledCondition={error || !email || !password || !repeatedPassword}
        backgroundColor={colors.black}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.divider} />
        <Text>O</Text>
        <Text style={styles.divider} />
      </View>
      <FormButton
        label="Registrarse con Google"
        onPress={handleGoogleSignUp}
        backgroundColor={colors.red}
      />
    </View>
  );
};

export default SignUpContainer;
