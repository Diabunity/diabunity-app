import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { DateTimePicker, Image, Text, TextField } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import { FormButton, BackButton } from '@/Components';

import { styles, colors } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorParams } from '@/Navigators/Application';

type Props = NativeStackScreenProps<NavigatorParams>;

const AddContainer = ({ navigation: { goBack, canGoBack } }: Props) => {
  const { Layout, Images } = useTheme();
  const [manualEnabled, setManualEnabled] = useState<boolean>(false);
  const [glucose, setGlucose] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [comments, setComments] = useState<string>();

  const refs: any = [];

  const isFormValid = (): boolean => {
    for (let i = 0; i < refs.length; i++) {
      if (!refs[i].isValid()) {
        refs[i].focus();
        return false;
      }
    }

    return true;
  };

  const handleNFCMeasure = () => {};

  const handleManualMeasure = (isAdd = false) => {
    if (isAdd) {
      const fullDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
    } else {
      setManualEnabled(true);
    }
  };

  return (
    <View style={{ ...Layout.fill, padding: 20 }}>
      <BackButton
        customBack={manualEnabled ? () => setManualEnabled(false) : undefined}
        goBack={goBack}
        customStyles={styles.back}
      />
      <Text style={styles.header}>
        {!manualEnabled ? 'Últimas 24 horas' : 'Añadir glucosa'}
      </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {manualEnabled ? (
          <>
            <Text>Concentración de glucosa en sangre</Text>
            <TextField
              migrate
              style={styles.input}
              ref={(ref: any) => refs.push(ref)}
              placeholder="mg/dL"
              onChangeText={(value: string) => setGlucose(value)}
              enableErrors
              validate={['required']}
              keyboardType={'numeric'}
              validationMessage={['Este campo es requerido']}
              validateOnChange
            />
            <Text>Fecha</Text>
            <DateTimePicker
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={styles.input}
              onChange={(date: Date): void => setDate(date)}
              value={date}
              mode="date"
            />
            <Text>Hora</Text>
            <DateTimePicker
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={styles.input}
              onChange={(time: Date): void => setTime(time)}
              value={time}
              is24Hour
              mode="time"
            />
            <Text>Observaciones</Text>
            <TextField
              migrate
              style={styles.input}
              ref={(ref: any) => refs.push(ref)}
              placeholder="Escribe algo"
              onChangeText={(value: string) => setGlucose(value)}
              enableErrors
              maxLength={30}
              validationMessage={['El texto no debe ser mayor a 30 caracteres']}
              validate={[(value: string) => value.length <= 30]}
              validateOnChange
            />
            <FormButton
              label="Agregar"
              onPress={() => handleManualMeasure(true)}
              labelStyle={styles.button}
              noMarginBottom
              backgroundColor={colors.red}
            />
          </>
        ) : (
          <>
            <Image style={Layout.size} source={Images.addDrop} />
            <FormButton
              label="Lectura nfc"
              onPress={handleNFCMeasure}
              labelStyle={styles.button}
              noMarginBottom
              backgroundColor={colors.red}
            />
            <FormButton
              label="Lectura manual"
              labelStyle={styles.button}
              noMarginBottom
              onPress={handleManualMeasure}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AddContainer;
