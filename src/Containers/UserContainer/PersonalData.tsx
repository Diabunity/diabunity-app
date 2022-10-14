import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native';

import {
  DateTimePicker,
  MaskedInput,
  Picker,
  PickerModes,
  TextField,
  Text,
  Incubator,
} from 'react-native-ui-lib';
import { Slider } from '@miblanchard/react-native-slider';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FormButton from '@/Components/FormButton';
import SliderContainer from '@/Components/Slider';
import { useTheme } from '@/Hooks';
import { User, userApi } from '@/Services/modules/users';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { styles } from './styles';

const PersonalData = ({
  data,
  user,
  refetchFn,
}: {
  data: User | null;
  user: FirebaseAuthTypes.User | null;
  refetchFn: () => void;
}) => {
  const [name, setName] = useState<string | undefined | null>(
    user?.displayName
  );
  const {
    birth_date = new Date(),
    weight: uWeight = '',
    height: uHeight = '',
    glucose_min = 0,
    glucose_max = 200,
    diabetes_type = 0,
  } = data || {};
  const [weight, setWeight] = useState<string>(uWeight?.toString());
  const [height, setHeight] = useState<string>(uHeight?.toString());
  const [type, setType] = useState<string>(diabetes_type?.toString());
  const [updateUser, { isLoading, isSuccess }] =
    userApi.useUpdateUserMutation();
  const [glucoseRange, setGlucoseRange] = useState<{
    min: number;
    max: number;
  }>({
    min: glucose_min,
    max: glucose_max,
  });

  const [date, setDate] = useState(new Date(birth_date));
  const { Layout, Colors } = useTheme();

  useEffect(() => {
    if (isSuccess) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'Se han actualizado los datos correctamente.',
        })
      );
    }
  }, [isSuccess]);

  const handleUpdate = async () => {
    const data: User = {
      id: user?.uid,
      diabetes_type: Number(type),
      birth_date: date,
      on_boarding: true,
      weight: Number(weight),
      height: Number(height),
      glucose_min: glucoseRange.min,
      glucose_max: glucoseRange.max,
    };

    try {
      if (name !== user?.displayName) {
        await user?.updateProfile({ displayName: name });
      }
      await updateUser(data);
      refetchFn();
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al actualizar los datos.',
        })
      );
    }
  };

  const renderMask = (value: string, maskTick: string) => (
    <View style={[Layout.rowHCenter]}>
      <Text style={styles.mask} center text60>
        {value || '0'}
        {maskTick}
      </Text>
    </View>
  );

  const handleOnChange = (
    value: string,
    setState: (value: string) => void
  ): void => setState(value);

  return (
    <ScrollView
      contentContainerStyle={[Layout.colCenter, { paddingBottom: 100 }]}
    >
      <Text style={styles.title}>Datos Personales</Text>
      <View style={{ ...styles.picker, ...styles.margin }}>
        <View>
          <Text style={styles.text}>Nombre: </Text>
        </View>
        <TextField
          style={styles.input}
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          migrate
          value={name}
          placeholder="Nombre"
          onChangeText={(value: string) => handleOnChange(value, setName)}
          enableErrors
          validate={['required', (value: string) => value.length > 3]}
          validationMessage={[
            'Este campo es requerido',
            'El texto debe ser mayor a 3 caracteres',
          ]}
          validateOnChange
          maxLength={30}
        />
      </View>
      <View style={{ ...styles.picker, ...styles.margin }}>
        <View>
          <Text style={styles.text}>Fecha de nacimiento: </Text>
        </View>
        <DateTimePicker
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={styles.input}
          onChange={(date: Date): void => setDate(date)}
          value={date}
          mode="date"
        />
      </View>
      <View style={styles.margin}>
        <View>
          <Text style={styles.text}>Peso: </Text>
        </View>
        <MaskedInput
          containerStyle={styles.input}
          migrate
          renderMaskedText={() => renderMask(weight, 'KG')}
          onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>): void =>
            handleOnChange(e.nativeEvent.text, setWeight)
          }
          maxLength={10}
          keyboardType={'numeric'}
          value={weight}
        />
      </View>
      <View style={styles.margin}>
        <View>
          <Text style={styles.text}>Altura: </Text>
        </View>
        <MaskedInput
          containerStyle={styles.input}
          migrate
          renderMaskedText={() => renderMask(height, 'CM')}
          onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>): void =>
            handleOnChange(e.nativeEvent.text, setHeight)
          }
          maxLength={10}
          keyboardType={'numeric'}
          value={height}
        />
      </View>
      <View>
        <View>
          <Text style={styles.text}>Tipo de diabetes: </Text>
        </View>
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
          onChange={(e: string): void => handleOnChange(e as string, setType)}
          topBarProps={{
            doneLabel: 'Done  ',
          }}
        >
          <Picker.Item label="Diabetes tipo 1" value="0" />
          <Picker.Item label="Diabetes tipo 2" value="1" />
        </Picker>
      </View>
      <View>
        <View>
          <Text style={styles.text}>Rango de glucosa: </Text>
        </View>
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
      <FormButton
        label="Actualizar datos personales"
        onPress={handleUpdate}
        labelStyle={styles.button}
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
    </ScrollView>
  );
};

export default PersonalData;
