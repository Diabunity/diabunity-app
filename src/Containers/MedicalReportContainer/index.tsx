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
// @ts-ignore
import Handlebars from 'react-native-handlebars/dist/handlebars';
import { useTheme } from '@/Hooks';
import { SensorLifeStatus } from '@/Services/modules/nfc';
import { DatePeriod, formatDate, getSensorLifeTime } from '@/Utils';
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
  SubscriptionType,
  User,
} from '@/Services/modules/users';
import PeriodChart from '@/Components/PeriodChart';

import { styles } from './styles';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { ActionSheet, Incubator } from 'react-native-ui-lib';

// @ts-ignore
import templateHtml from '@/Templates/report.html';

type Props = {
  data?: Measurements;
  user?: User;
  name?: string | null;
  sensorLife?: number;
  navigate: (route: string) => void;
};
const MedicalReportContainer = ({
  data,
  user,
  name,
  sensorLife,
  navigate,
}: Props) => {
  const { Colors } = useTheme();
  const [source, setSource] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [reportVisible, setReportVisible] = useState<boolean>(false);
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

  const handleCapture = async (period: DatePeriod) => {
    const { subscription_type } = user?.subscription || {};
    const isUserPremium = subscription_type === SubscriptionType.PREMIUM;
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
    const template = Handlebars.compile(templateHtml);
    const options = {
      html: template({
        base64Logo,
        source,
        name,
        date,
        height,
        weight,
        diabetesType,
        glucoseRange,
      }),
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
            .tendency(TENDENCY.UNKNOWN)
            .periodInTarget(periodInTarget.value, periodInTarget.status)
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
          onPress={() => setReportVisible(true)}
          isProFeature
          centered
          noMarginBottom
          disabledCondition={loading}
          backgroundColor={Colors.red}
        />
        <ActionSheet
          title={'Elije el tipo de reporte'}
          destructiveButtonIndex={0}
          useNativeIOS
          migrateDialog
          options={[
            {
              label: 'Reporte diario',
              onPress: () => handleCapture(DatePeriod.LAST_DAY),
            },
            {
              label: 'Reporte semanal',
              onPress: () => handleCapture(DatePeriod.LAST_WEEK),
            },
          ]}
          visible={reportVisible}
          onDismiss={() => setReportVisible(false)}
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
