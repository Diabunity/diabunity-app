import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  View,
  ViewStyle,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useTheme } from '@/Hooks';
import { SensorLifeStatus } from '@/Services/modules/nfc';
import { formatDate, getSensorLifeTime } from '@/Utils';
import Table, {
  TableBuilder,
  TENDENCY,
} from '@/Containers/HomeContainer/Table';

import FormButton from '@/Components/FormButton';
import LastDayChart from '@/Components/LastDayChart';
import { base64Logo } from '@/Constants';
import {
  DiabetesType,
  Measurements,
  MeasurementStatus,
  PeriodInTargetStatus,
  User,
} from '@/Services/modules/users';
import PeriodChart from '@/Components/PeriodChart';

import { styles } from './styles';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { Incubator } from 'react-native-ui-lib';
import { navigate } from '@/Navigators/utils';

type Props = {
  data?: Measurements;
  user?: User;
  name?: string | null;
  sensorLife?: number;
  navigate: (route: string) => void;
};
const MedicalReportContainer = ({ data, user, name, sensorLife }: Props) => {
  const { Colors } = useTheme();
  const [source, setSource] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const average = data?.avg || { value: 0, status: MeasurementStatus.OK };
  const periodInTarget = data?.periodInTarget || {
    value: 0,
    status: PeriodInTargetStatus.GOOD,
  };
  const { age, status = SensorLifeStatus.UNKNOWN } =
    getSensorLifeTime(sensorLife);
  const [currentGlucose = { measurement: 0, status: MeasurementStatus.OK }] = [
    data?.measurements?.[0],
  ];

  const onCapture = useCallback(
    (type: string, uri: string) =>
      setSource((prevState: any) => ({
        ...prevState,
        [type]: uri,
      })),
    []
  );
  const lastDayRef = useRef<any>();
  const periodRef = useRef<any>();
  const tableRef = useRef<any>();

  const handleCapture = async () => {
    const isUserPremium = false; // TODO: We have to make a backend call to check this.
    if (!isUserPremium) {
      navigate('WithoutPremium');
      return;
    }
    setLoading(true);
    await lastDayRef.current.capture();
    await periodRef.current.capture();
    await tableRef.current.capture();
  };

  useEffect(() => {
    const keys = ['period', 'daily', 'table'];
    const fetchPDF = async () => {
      await createPDF();
    };
    if (Object.keys(source).length === keys.length) fetchPDF();
  }, [source]);

  const createPDF = async () => {
    const date = user?.birth_date
      ? formatDate(new Date(user.birth_date))
      : 'No especificado.';
    const weight = user?.weight ? `${user.weight}KG` : 'No especificado.';
    const height = user?.height ? `${user.height}CM` : 'No especificado.';
    const diabetesType =
      user?.diabetes_type === DiabetesType.TYPE_1 ? 'Tipo 1' : 'Tipo 2';
    const glucoseRange = `${user?.glucose_min}mg/dl - ${user?.glucose_max}mg/dl`;
    const today = new Date();
    const options = {
      html: `<img src=${base64Logo} width=400 /><h1>Datos personales</h1><h2>Paciente: ${name} </h2><h2>Fecha de nacimiento: ${date} </h2><h2>Altura: ${height} </h2><h2>Peso: ${weight} </h2><h2>Tipo de diabetes: ${diabetesType} </h2><h2>Rango de glucosa: ${glucoseRange} </h2><h1>Reporte</h1><h2>Últimas 24 horas</h2><p><img src="data:image/png;base64,${source.daily}" height=900 /></p><div><br><br><h2>Periodo en objetivo</h2><img src="data:image/png;base64,${source.period}" height=400 /></div><p><h2>Datos Estadísticos</h2><img src="data:image/png;base64, ${source.table}" /></p>`,
      fileName: `reporte-medico-${Math.floor(
        today.getTime() + today.getSeconds() / 2
      )}`,
      directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      if (file.filePath) {
        await FileViewer.open(file.filePath, {
          showOpenWithDialog: true,
          displayName: 'Diabunity - Reporte médico',
        });
      }
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al generar el reporte.',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getViewShotStyle = (width: number, height: number) => {
    return {
      width,
      height,
      position: 'absolute',
      right: -width - 20,
    } as ViewStyle;
  };

  const tableWidth = Dimensions.get('window').width;
  const tableHeight = Dimensions.get('window').height;

  const periodData = [
    {
      name: 'En Rango',
      percentage: periodInTarget.value,
      color: Colors.success,
      legendFontColor: Colors.text,
      legendFontSize: 10,
    },
    {
      name: 'Fuera de Rango',
      percentage: 1 - periodInTarget.value,
      color: Colors.red,
      legendFontColor: Colors.text,
      legendFontSize: 10,
    },
  ];
  return (
    <View>
      <ViewShot
        onCapture={(uri: string) => onCapture('daily', uri)}
        ref={lastDayRef}
        options={{ result: 'base64' }}
        style={getViewShotStyle(1024, 300)}
      >
        <LastDayChart measurements={data?.measurements} />
      </ViewShot>
      <ViewShot
        onCapture={(uri: string) => onCapture('period', uri)}
        ref={periodRef}
        options={{ result: 'base64' }}
        style={getViewShotStyle(1024, 100)}
      >
        <PeriodChart data={periodData} />
      </ViewShot>
      <ViewShot
        onCapture={(uri: string) => onCapture('table', uri)}
        ref={tableRef}
        options={{ result: 'base64' }}
        style={getViewShotStyle(tableWidth, tableHeight)}
      >
        <Table
          data={new TableBuilder()
            .tendency(TENDENCY.EQUAL)
            .periodInTarget(periodInTarget.value, periodInTarget.status)
            .lastScanMeasure(
              currentGlucose.measurement,
              currentGlucose.status || MeasurementStatus.OK
            )
            .average(
              Math.round(parseFloat(average.value.toString())),
              average.status
            )
            .sensorLife(age, status)
            .build()}
        />
      </ViewShot>
      <View style={{ marginTop: 10 }}>
        <FormButton
          label="Generar reporte médico"
          onPress={handleCapture}
          isProFeature
          centered
          noMarginBottom
          disabledCondition={loading}
          backgroundColor={Colors.red}
        />
      </View>
      {loading && (
        <ActivityIndicator
          style={styles.done}
          size="small"
          color={Colors.black}
        />
      )}
    </View>
  );
};

export default MedicalReportContainer;
