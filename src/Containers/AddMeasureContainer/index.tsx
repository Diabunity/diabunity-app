import React, { useState, useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';
import {
  DateTimePicker,
  Image,
  Incubator,
  Text,
  TextField,
} from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/Hooks';
import { store } from '@/Store';
import { FormButton, BackButton } from '@/Components';

import { NavigatorParams } from '@/Navigators/Application';
import { NFCReader } from '@/Services/modules/nfc';
import AuthService from '@/Services/modules/auth';
import { userApi, MeasurementMode } from '@/Services/modules/users';
import { setNotification } from '@/Store/Notification';
import { addMinutes, DatePeriod, setByTimezone } from '@/Utils';
import { TOAST_TIMEOUT } from '@/Constants';
import { TENDENCY } from '../HomeContainer/Table';

import { styles, colors } from './styles';

type Props = NativeStackScreenProps<NavigatorParams>;

const AddMeasureContainer = ({ navigation: { goBack, navigate } }: Props) => {
  const { Layout, Images, Colors } = useTheme();
  const user = AuthService.getCurrentUser();
  const [saveMeasurement, { isLoading, isSuccess, isError, error, reset }] =
    userApi.useSaveMeasurementMutation();
  const { data } = userApi.useFetchMeasurementQuery({
    id: user?.uid,
    dateFilter: DatePeriod.LAST_DAY,
  });
  const dailyMasurements = data?.measurements || [];
  const [supported, setSupported] = useState<boolean>(false);
  const [nfcInstance, setNFCInstance] = useState<NFCReader>();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPassedDailyMeasurements, setHasPassedDailyMeasurements] =
    useState(false);
  const [manualEnabled, setManualEnabled] = useState<boolean>(false);
  const [measurement, setMeasurement] = useState<string>();
  const [sensorLife, setSensorLife] = useState<number | undefined>();
  const [tendency, setTendency] = useState<TENDENCY | undefined>();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [comments, setComments] = useState<string>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      reset();
      resetFields();
    }
  }, [isFocused]);

  useEffect(() => {
    const init = async () => {
      const NFCObj = new NFCReader();
      const hasNFCSupport = await NFCObj.init();
      setSupported(hasNFCSupport);
      if (hasNFCSupport) {
        setNFCInstance(NFCObj);
      }
    };
    init();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isSuccess && tendency !== undefined) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'Medicion cargada exitosamente.',
        })
      );

      timer = setTimeout(() => {
        navigate('Home', {
          refetch: new Date().toISOString(),
          sensorLife,
          tendency,
        });
        setManualEnabled(false);
        reset();
        resetFields();
      }, TOAST_TIMEOUT);
    }
    if (isError) {
      crashlytics().recordError(error, 'Error trying to save a measurement');
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al cargar la medicion, intente nuevamente.',
        })
      );
      timer = setTimeout(() => {
        reset();
      }, TOAST_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, isError, tendency]);

  const resetFields = () => {
    setDate(new Date());
    setTime(new Date());
    setComments(undefined);
    setMeasurement(undefined);
  };

  const handleNFCMeasure = async () => {
    const isIOS = Platform.OS === 'ios';
    let timer;
    let glucoseData;
    if (!nfcInstance || isScanning) {
      return;
    }
    setIsScanning(true);
    try {
      if (isIOS) {
        timer = setTimeout(() => setIsScanning(false), 1000); //This is a workaround for iOS since the lib does not return the onCancel event
      }
      glucoseData = await nfcInstance.getGlucoseData();
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al leer el parche.',
        })
      );
    } finally {
      if (glucoseData) {
        const {
          history,
          current_glucose: currentGlucose,
          trend_history,
          sensorLife: sensorAge,
        } = glucoseData;
        setSensorLife(sensorAge);
        const measurements = [];
        let timestamp = addMinutes(new Date(), 15);
        for (const measurement of history) {
          const value = isIOS ? measurement : measurement.value;
          if (value > 0) {
            timestamp = isIOS
              ? addMinutes(timestamp, -15)
              : new Date(Number(measurement.utcTimeStamp));
            const m = {
              measurement: value,
              timestamp: timestamp.toISOString(),
              source: MeasurementMode.SENSOR,
            };
            measurements.push(m);
          }
        }
        const currentValue = isIOS ? currentGlucose[0] : currentGlucose;
        if (currentValue > 0) {
          measurements.push({
            measurement: currentValue,
            timestamp: setByTimezone(new Date(Date.now())).toISOString(),
            source: MeasurementMode.SENSOR,
          });
        }
        if (measurements.length > 0) {
          const sensorDailyMeasurements = dailyMasurements?.filter(
            (m) => m.source === MeasurementMode.SENSOR
          );
          // This number is the maximum number of measurements for the free plan. It should come from the backend
          if (sensorDailyMeasurements.length >= 64) {
            setHasPassedDailyMeasurements(true);
            navigate('WithoutPremium');
            return;
          } else {
            const { data } = (await saveMeasurement({
              measurements,
              trend_history: trend_history.map(
                (m: { value: number }) => m.value
              ),
            })) as { data: { tendency: TENDENCY } };
            setTendency(data.tendency ?? TENDENCY.UNKNOWN);
          }
        }
      }
      clearTimeout(timer);
      setIsScanning(false);
    }
  };

  const handleManualMeasure = async (isAdd = false) => {
    if (isAdd) {
      const newDate = setByTimezone(date);
      const newTime = setByTimezone(time);
      const timestamp = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        newTime.getHours(),
        newTime.getMinutes()
      ).toISOString();

      const measurements = [
        {
          measurement: Number(measurement),
          timestamp,
          source: MeasurementMode.MANUAL,
          comments,
        },
      ];

      const { data } = (await saveMeasurement({
        measurements,
        trend_history: [],
      })) as { data: { tendency: TENDENCY } };
      setTendency(data.tendency ?? TENDENCY.UNKNOWN);
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
            <View style={{ marginBottom: 20 }}>
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

            <View style={styles.text}>
              <Text>Hora</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <DateTimePicker
                migrateTextField
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={styles.input}
                onChange={(time: Date): void => setTime(time)}
                value={time}
                is24Hour
                timeFormat="HH:mm"
                mode="time"
              />
            </View>
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
              isProFeature={hasPassedDailyMeasurements}
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

export default AddMeasureContainer;
