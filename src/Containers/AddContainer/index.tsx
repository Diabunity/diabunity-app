import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';
import {
  DateTimePicker,
  Image,
  Incubator,
  Text,
  TextField,
  Toast,
} from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/Hooks';
import { FormButton, BackButton } from '@/Components';

import { NavigatorParams } from '@/Navigators/Application';
import { NFCReader } from '@/Services/modules/nfc';
import { userApi, MeasurementMode } from '@/Services/modules/users';
import { addMinutes } from '@/Utils';

import { styles, colors } from './styles';

type Props = NativeStackScreenProps<NavigatorParams>;

const TOAST_TIMEOUT = 1000;

const AddContainer = ({ navigation: { goBack, navigate } }: Props) => {
  const { Layout, Images, Colors } = useTheme();
  const [saveMeasurement, { isLoading, isSuccess, isError, reset }] =
    userApi.useSaveMeasurementMutation();

  const [supported, setSupported] = useState<boolean>(false);
  const [nfcInstance, setNFCInstance] = useState<NFCReader>();
  const [isScanning, setIsScanning] = useState(false);
  const [manualEnabled, setManualEnabled] = useState<boolean>(false);
  const [measurement, setMeasurement] = useState<string>();
  const [sensorLife, setSensorLife] = useState<number | undefined>();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [comments, setComments] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const NFCObj = new NFCReader();
      setSupported(await NFCObj.init());
      if (supported) {
        setNFCInstance(NFCObj);
      }
    };
    init();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isSuccess) {
      timer = setTimeout(() => {
        navigate('Home', { refetch: true, sensorLife });
        setManualEnabled(false);
        reset();
      }, TOAST_TIMEOUT);
    }
    if (isError) {
      timer = setTimeout(() => {
        reset();
      }, TOAST_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, isError]);

  const handleNFCMeasure = async () => {
    const isIOS = Platform.OS === 'ios';
    if (!nfcInstance || isScanning) {
      return;
    }
    setIsScanning(true);
    const glucoseData = await nfcInstance.getGlucoseData();
    setIsScanning(false);
    if (glucoseData) {
      const { history, sensorLife: sensorAge } = glucoseData;
      setSensorLife(sensorAge);
      const measurements = [];
      const timestamp = addMinutes(new Date(), 15);
      for (const measurement of history) {
        const m = {
          measurement: isIOS ? measurement : measurement.value,
          timestamp: isIOS
            ? addMinutes(timestamp, -15)
            : measurement.utcTimeStamp,
          source: MeasurementMode.SENSOR,
        };
        measurements.push(m);
      }
      if (measurements.length > 0) {
        await saveMeasurement(measurements);
      }
    }
  };

  const handleManualMeasure = async (isAdd = false) => {
    if (isAdd) {
      const timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
      const measurements = [
        {
          measurement: Number(measurement),
          timestamp,
          source: MeasurementMode.MANUAL,
          comments,
        },
      ];

      await saveMeasurement(measurements);
    } else {
      setManualEnabled(true);
    }
  };

  return (
    <View style={{ ...Layout.fill, padding: 20 }}>
      <Toast
        visible={isSuccess || isError}
        position="top"
        autoDismiss={TOAST_TIMEOUT}
        backgroundColor={isError ? Colors.error : Colors.success}
        message={
          isSuccess
            ? 'Medicion cargada exitosamente.'
            : 'Hubo un error al cargar la medicion, intente nuevamente.'
        }
        preset={
          isSuccess
            ? Incubator.ToastPresets.SUCCESS
            : Incubator.ToastPresets.FAILURE
        }
      />
      <BackButton
        customBack={manualEnabled ? () => setManualEnabled(false) : undefined}
        goBack={goBack}
        customStyles={styles.back}
      />
      <Text style={styles.header}>
        {!manualEnabled ? 'Agregar nueva medición' : 'Añadir glucosa'}
      </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {manualEnabled ? (
          <View style={{ ...Layout.column }}>
            <View style={styles.text}>
              <Text>Concentración de glucosa en sangre</Text>
            </View>
            <TextField
              migrate
              style={styles.input}
              placeholder="mg/dL"
              onChangeText={(value: string) => setMeasurement(value)}
              enableErrors
              validate={['required']}
              keyboardType={'numeric'}
              validationMessage={['Este campo es requerido']}
              validateOnChange
            />
            <View style={styles.text}>
              <Text>Fecha</Text>
            </View>
            <DateTimePicker
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={styles.input}
              onChange={(date: Date): void => setDate(date)}
              value={date}
              mode="date"
            />
            <View style={styles.text}>
              <Text>Hora</Text>
            </View>
            <DateTimePicker
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={styles.input}
              onChange={(time: Date): void => setTime(time)}
              value={time}
              is24Hour
              timeFormat="HH:mm"
              mode="time"
            />
            <View style={styles.text}>
              <Text>Observaciones</Text>
            </View>
            <TextField
              migrate
              style={styles.input}
              placeholder="Escribe algo"
              onChangeText={(value: string) => setComments(value)}
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
              disabledCondition={!measurement}
              noMarginBottom
              backgroundColor={colors.red}
            />
            {isLoading && (
              <ActivityIndicator
                style={styles.done}
                size="small"
                color={Colors.black}
              />
            )}
          </View>
        ) : (
          <>
            <Image style={Layout.size} source={Images.addDrop} />
            <FormButton
              label="Lectura nfc"
              onPress={handleNFCMeasure}
              labelStyle={styles.button}
              noMarginBottom
              disabledCondition={isScanning || !supported}
              activeOpacity={!isScanning ? 0.5 : 1}
              backgroundColor={colors.red}
            />
            {!supported && (
              <View style={styles.notSupported}>
                <Text>El dispositivo no soporta NFC</Text>
              </View>
            )}
            <FormButton
              label="Lectura manual"
              labelStyle={styles.button}
              noMarginBottom
              onPress={() => handleManualMeasure(false)}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AddContainer;
