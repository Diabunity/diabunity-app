import {
  ActivityIndicator,
  Image,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import Icon from 'react-native-vector-icons/Feather';
import {
  DateTimePicker,
  Text,
  Slider,
  MaskedInput,
  Picker,
  PickerModes,
} from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/Hooks';
import { userApi, User } from '@/Services/modules/users';
import AuthService from '@/Services/modules/auth';

import { styles } from './styles';
import { NavigatorParams } from '@/Navigators/Application';

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
}: {
  isLight: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity>
    <Text
      onPress={onPress}
      style={{
        ...styles.done,
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
    max: 200,
    min: 0,
  });
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [type, setType] = useState<string>();

  const handleOnChange = (
    value: string,
    setState: (value: string) => void
  ): void => setState(value);

  useEffect(() => {
    if (isSuccess) {
      navigate('Main');
    }
  }, [isSuccess]);

  const handleOnDone = async (): Promise<void> => {
    const user: User = {
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
          : Done
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
            <View style={{ marginTop: 26, flex: 1, flexDirection: 'row' }}>
              <Text style={{ position: 'absolute', top: 50 }} bodySmall>
                {glucoseRange.min} mg/dL
              </Text>
              <Slider
                useRange
                onRangeChange={(range) => setGlucoseRange(range)}
                containerStyle={styles.slider}
                thumbTintColor={styles.slider.color}
                minimumTrackTintColor={styles.slider.color}
                minimumValue={0}
                maximumValue={200}
                step={1}
              />
              <Text
                style={{ position: 'absolute', top: 50, right: 0 }}
                bodySmall
              >
                {glucoseRange.max} mg/dL
              </Text>
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
