import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import { AirbnbRating } from 'react-native-ratings';
import { NavigatorParams } from '@/Navigators/Application';
import { Incubator, TextField } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import FormButton from '@/Components/FormButton';
import { BackButton } from '@/Components';
import { Feedback, userApi } from '@/Services/modules/users';
import { styles } from './styles';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';

type Props = NativeStackScreenProps<NavigatorParams>;

const FeedbackContainer = ({ navigation: { goBack, canGoBack } }: Props) => {
  const { Layout, Colors } = useTheme();
  const [content, setContent] = useState<string>('NO_CONTENT');
  const [rating, setRating] = useState<number>(5);
  const [saveFeedback, { isLoading, isError, isSuccess, error }] =
    userApi.useSaveFeedbackMutation();

  const onSubmit = async () => {
    const feedback: Partial<Feedback> = { comment: content, stars: rating };
    await saveFeedback(feedback);
  };

  useEffect(() => {
    if (isSuccess) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'Tu opinión se ha enviado correctamente. Muchas gracias!',
        })
      );
    }
    if (isError) {
      const parsedError = new Error(error?.error);
      crashlytics().recordError(parsedError, 'Error saving feedback');
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message:
            'Hubo un error al enviar la opinión. Intente nuevamente mas tarde',
        })
      );
    }

    if (isSuccess || isError) {
      goBack();
    }
  }, [isSuccess, isError]);

  return (
    <View style={[Layout.fill]}>
      <BackButton goBack={goBack} canGoBack={canGoBack} customIcon="x" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[Layout.fill, Layout.center]}>
          <Text style={styles.title}>Ayudanos a mejorar</Text>
          <Text style={styles.subtitle}>Dejanos tu opinion.</Text>
          <AirbnbRating
            count={5}
            reviews={['Muy Mala', 'Mala', 'Regular', 'Buena', 'Muy Buena']}
            defaultRating={5}
            size={30}
            onFinishRating={(value: number) => setRating(value)}
          />
          <TextField
            migrate
            onChangeText={(value: string) => setContent(value)}
            style={styles.textBox}
            showCharCounter
            multiline={true}
            numberOfLines={5}
            placeholder="Escribe algo..."
          />
          <View style={[Layout.colCenter]}>
            <FormButton
              label="Enviar"
              onPress={onSubmit}
              noMarginBottom
              backgroundColor={Colors.red}
            />
            {isLoading && (
              <ActivityIndicator
                style={styles.done}
                size="small"
                color={Colors.black}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FeedbackContainer;
