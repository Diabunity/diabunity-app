import {
  ActivityIndicator,
  Image,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import Onboarding from 'react-native-onboarding-swiper';
import { Slider } from '@miblanchard/react-native-slider';
import {
  DateTimePicker,
  Text,
  MaskedInput,
  Picker,
  PickerModes,
  ThemeManager,
  Colors,
  Checkbox,
} from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/Hooks';
import { userApi, User } from '@/Services/modules/users';
import AuthService from '@/Services/modules/auth';

import { styles, COLORS } from './styles';
import { NavigatorParams } from '@/Navigators/Application';
import SliderContainer from '@/Components/Slider';
import { ExternalLink } from '@/Components';

ThemeManager.setComponentTheme('Incubator.WheelPicker', () => {
  return {
    activeTextColor: COLORS.red,
  };
});

Colors.loadColors({
  primary: COLORS.red,
});

const Dot = ({
  isLight,
  selected,
}: {
  isLight: boolean;
  selected: boolean;
}) => {
  let backgroundColor;
  if (isLight) {
    backgroundColor = selected ? styles.slider.color : '#000000';
  } else {
    backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
  }
  return <View style={{ ...styles.dot, backgroundColor }} />;
};

const Done = ({
  isLight,
  onPress,
  acceptedTerms,
}: {
  isLight: boolean;
  onPress: () => void;
  acceptedTerms?: boolean;
}) => (
  <TouchableOpacity disabled={!acceptedTerms}>
    <Text
      onPress={acceptedTerms ? onPress : undefined}
      style={{
        ...styles.done,
        opacity: acceptedTerms ? 1 : 0.3,
        color: isLight ? 'rgba(0, 0, 0, 0.8)' : '#fff',
      }}
    >
      Finalizar
    </Text>
  </TouchableOpacity>
);

type Props = NativeStackScreenProps<NavigatorParams>;

const OnboardingContainer = ({ navigation: { navigate } }: Props) => {
  const { Images, Colors, Layout } = useTheme();
  const [saveUser, { isLoading, isSuccess }] = userApi.useSaveUserMutation();
  const [page, setPage] = useState<number>(0);
  const [glucoseRange, setGlucoseRange] = useState<{
    max: number;
    min: number;
  }>({
    max: 130,
    min: 80,
  });
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [type, setType] = useState<string>();
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const handleOnChange = (
    value: string,
    setState: (value: string) => void
  ): void => setState(value);

  useEffect(() => {
    analytics().logEvent('onboarding_started');
    crashlytics().log('Start Onboarding');
  }, []);

  useEffect(() => {
    if (isSuccess) {
      crashlytics().log('Finish Onboarding');
      navigate('Main');
    }
  }, [isSuccess, navigate]);

  const handleOnDone = async (): Promise<void> => {
    const user: Partial<User> = {
      id: AuthService.getCurrentUser()?.uid,
      diabetes_type: Number(type),
      birth_date: date,
      on_boarding: true,
      weight: Number(weight),
      height: Number(height),
      glucose_min: glucoseRange.min,
      glucose_max: glucoseRange.max,
    };

    await saveUser(user);
  };

  const renderMask = (value: string, maskTick: string) => (
    <View style={[Layout.rowHCenter]}>
      <Text style={styles.mask} center text60>
        {value || '0'}
        {maskTick}
      </Text>
    </View>
  );

  return (
    <Onboarding
      nextLabel="Siguiente"
      skipLabel="Anterior"
      skipToPage={page - 1}
      pageIndexCallback={(pageIndex) => setPage(pageIndex)}
      showSkip={!!page}
      bottomBarHighlight={false}
      DoneButtonComponent={
        isLoading
          ? () => (
              <ActivityIndicator
                style={styles.done}
                size="small"
                color={Colors.black}
              />
            )
          : (props) => <Done {...props} acceptedTerms={acceptedTerms} />
      }
      DotComponent={Dot}
      containerStyles={styles.pageContainer}
      imageContainerStyles={styles.pageImage}
      onDone={handleOnDone}
      pages={[
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding1} />,
          title: 'Hola!',
          subtitle:
            'Queremos ayudarte a que tengas una experiencia más personalizada y para eso es necesario que completes algunos datos.',
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding2} />,
          title: '¿Cuándo naciste?',
          subtitle: (
            <View style={styles.pageSubtitleContainer}>
              <DateTimePicker
                migrateTextField
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={styles.input}
                onChange={(date: Date): void => setDate(date)}
                value={date}
                mode="date"
              />
            </View>
          ),
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding3} />,
          title: '¿Cuánto pesas?',
          subtitle: (
            <View style={styles.pageSubtitleContainer}>
              <MaskedInput
                containerStyle={styles.input}
                migrate
                renderMaskedText={(value: string) => renderMask(value, 'KG')}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>
                ): void => handleOnChange(e.nativeEvent.text, setWeight)}
                maxLength={10}
                keyboardType={'numeric'}
                value={weight}
              />
            </View>
          ),
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding4} />,
          title: '¿Cuánto Medis?',
          subtitle: (
            <View style={styles.pageSubtitleContainer}>
              <MaskedInput
                containerStyle={styles.input}
                migrate
                renderMaskedText={(value: string) => renderMask(value, 'CM')}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>
                ): void => handleOnChange(e.nativeEvent.text, setHeight)}
                maxLength={10}
                keyboardType={'numeric'}
                value={height}
              />
            </View>
          ),
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding5} />,
          title: 'Tipo de diabetes',
          subtitle: (
            <View style={styles.pageSubtitleContainer}>
              <Picker
                value={type}
                useWheelPicker
                labelStyle={{
                  color: Colors.primary,
                }}
                migrateTextField
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={styles.input}
                mode={PickerModes.SINGLE}
                placeholder={'Selecciona un tipo'}
                onChange={(e: string): void =>
                  handleOnChange(e as string, setType)
                }
                topBarProps={{
                  doneLabel: 'Done  ',
                }}
              >
                <Picker.Item label="Diabetes tipo 1" value="0" />
                <Picker.Item label="Diabetes tipo 2" value="1" />
              </Picker>
            </View>
          ),
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
        {
          backgroundColor: Colors.white,
          image: <Image source={Images.onboarding6} />,
          title: 'Rango de glucosa',
          subtitle: (
            <View style={[Layout.fill, Layout.colCenter]}>
              <View
                style={[styles.glucoseRangeContainer, Layout.justifyContent]}
              >
                <SliderContainer
                  onValueChange={(value: number[]): void => {
                    const [min, max] = value;
                    setGlucoseRange({ min, max });
                  }}
                  sliderValue={[glucoseRange.min, glucoseRange.max]}
                >
                  <Slider maximumValue={200} minimumValue={0} step={1} />
                </SliderContainer>
              </View>
              <View style={[Layout.fill, Layout.justifyContent]}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={acceptedTerms}
                    onValueChange={(value: boolean) => setAcceptedTerms(value)}
                    color={Colors.red}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>He leído y acepto los</Text>
                  <ExternalLink
                    style={{ color: Colors.red }}
                    url="https://diabunity.com/terminos-y-condiciones"
                  >
                    Términos y Condiciones
                  </ExternalLink>
                </View>
              </View>
            </View>
          ),
          titleStyles: styles.pageTitle,
          subTitleStyles: styles.pageSubtitle,
        },
      ]}
    />
  );
};

export default OnboardingContainer;
