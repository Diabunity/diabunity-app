import React, { createRef, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorParams } from '@/Navigators/Application';
import { useTheme } from '@/Hooks';
import { Text, Incubator } from 'react-native-ui-lib';
import { BackButton, FormButton } from '@/Components';
import AuthService from '@/Services/modules/auth';

import { styles } from './styles';

const { Toast, TextField } = Incubator;

enum Label {
  SEND = 'Enviar',
  SENT = 'Enviado',
}

type Props = NativeStackScreenProps<NavigatorParams>;

const ForgotPasswordContainer = ({
  navigation: { goBack, canGoBack },
}: Props) => {
  const [error, setError] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [label, setLabel] = useState<string>(Label.SEND);
  const { Layout, Images, Colors } = useTheme();

  const textFieldRef: any = createRef();

  const onSendEmailPress = async (): Promise<void> => {
    if (!textFieldRef.current.isValid()) {
      textFieldRef.current.focus();
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.sendPasswordResetEmail(email);
      setEmailSent(true);
      setLabel(Label.SENT);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[Layout.fill]}>
      <BackButton goBack={goBack} canGoBack={canGoBack} />
      <View style={[Layout.fill, Layout.colCenter]}>
        <Toast
          visible={error}
          position="top"
          autoDismiss={3000}
          message="Ups, hubo un problema al enviar el correo"
          preset={Incubator.ToastPresets.FAILURE}
          onDismiss={() => setError(false)}
        />
        <Image style={Layout.size} source={Images.logo} />
        <Text style={styles.text}>
          Te enviaremos un correo electrónico con las instrucciones para
          restablecer tu contraseña.
        </Text>
        <TextField
          style={styles.textField}
          ref={textFieldRef}
          migrate
          placeholder="Email"
          onChangeText={(value: string) => setEmail(value)}
          enableErrors
          validate={['required', 'email']}
          validateOnChange
          validationMessage={[
            'Este campo es requerido',
            'El email es inválido',
          ]}
          maxLength={30}
        />
        <FormButton
          label={label}
          disabledCondition={!email || emailSent}
          onPress={onSendEmailPress}
        />
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="small"
            color={Colors.black}
          />
        )}
      </View>
    </View>
  );
};

export default ForgotPasswordContainer;
