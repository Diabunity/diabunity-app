import React, { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { NavigatorParams } from '@/Navigators/Application';
import AuthService from '@/Services/modules/auth';
import Icon from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useTheme } from '@/Hooks';
import {
  Measurement,
  MeasurementStatus,
  userApi,
} from '@/Services/modules/users';
import { DatePeriod } from '@/Utils';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { styles } from './styles';
import { SkeletonView, View } from 'react-native-ui-lib';
import DatePicker from 'react-native-date-ranges';

type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<
    { params?: { refetch: boolean; sensorLife?: number } },
    'params'
  >;
};

const COLORS = {
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
  white: '#ffffff',
};

const tableStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    marginTop: 15,
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: COLORS.gray,
  },
  dateAndSource: {
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  index: {
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  value: {
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '35%',
  },
  pageInfoContainer: {
    justifyContent: 'flex-end',
  },
  chevron: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  enabled: {
    color: 'rgba(0, 0, 0, 0.54)',
    marginLeft: 42,
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.2)',
    marginLeft: 38,
  },
});

const STATUS_COLORS: { [key in MeasurementStatus]: string } = {
  [MeasurementStatus.LOW]: '#0060B9',
  [MeasurementStatus.OK]: '#0EB500',
  [MeasurementStatus.HIGH]: '#DB7600',
  [MeasurementStatus.SUPER_HIGH]: '#C1272D',
};

const STATUS_LABEL: { [key in MeasurementStatus]: string } = {
  [MeasurementStatus.LOW]: 'BAJO',
  [MeasurementStatus.OK]: 'OK',
  [MeasurementStatus.HIGH]: 'ALTO',
  [MeasurementStatus.SUPER_HIGH]: 'HIPER GLUCEMIA',
};

const DatePickerr = () => {
  const [dateTo, setDateTo] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(new Date());

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        marginTop: 15,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.white,
        ...tableStyles.dropShadow,
      }}
    >
      <DatePicker
        style={{ height: 32, borderWidth: 0 }}
        customStyles={{
          placeholderText: { fontSize: 16 }, // placeHolder style
          headerStyle: { backgroundColor: 'red' }, // title container style
          headerMarkTitle: {}, // title mark style
          headerDateTitle: { fontSize: 16 }, // title Date style
          contentInput: {}, //content text container style
          contentText: { fontSize: 16 }, //after selected text Style
        }} // optional
        placeholder={'22 de Julio, 2022 → 27 de Julio, 2022'}
        outFormat={'DD ' + '\\d\\e ' + 'MMMM' + ', YYYY'}
        headFormat={'DD ' + '\\d\\e ' + 'MMMM' + ', YYYY'}
        mode={'range'}
        ButtonText="Seleccionar"
        ButtonStyle={{}}
        markText=" "
        clearStart="Desde"
        clearEnd="Hasta"
        onConfirm={(f) => {
          console.log(f);
        }}
      />
    </View>
  );
};

const Table = ({ data }: { data: Array<Measurement> }) => {
  return (
    <>
      <DatePickerr />
      <View style={{ ...tableStyles.container, ...tableStyles.dropShadow }}>
        {data.map((item, index) => (
          <View key={index} style={tableStyles.row}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '30%',
                alignItems: 'flex-start',
              }}
            >
              <Text style={tableStyles.dateAndSource}>
                {new Date(item.timestamp).getFullYear()}
              </Text>
              <Text style={tableStyles.dateAndSource}>09:15:00:hs</Text>
              <Text style={tableStyles.dateAndSource}>FreeStyle</Text>
            </View>
            <Text
              style={{
                ...tableStyles.value,
                color: STATUS_COLORS[item.status!],
              }}
            >
              {item.measurement} mg/dL
            </Text>
            <Text
              style={{
                ...tableStyles.value,
                color: STATUS_COLORS[item.status!],
              }}
            >
              {STATUS_LABEL[item.status!]}
            </Text>
          </View>
        ))}
        <View style={{ ...tableStyles.row, ...tableStyles.pageInfoContainer }}>
          <Text style={tableStyles.index}>1-5 de 10</Text>
          <Text
            style={{
              ...tableStyles.index,
              ...tableStyles.chevron,
              ...tableStyles.disabled,
            }}
          >
            &#10094;
          </Text>
          <Text
            style={{
              ...tableStyles.index,
              ...tableStyles.chevron,
              ...tableStyles.enabled,
            }}
          >
            &#10095;
          </Text>
        </View>
      </View>
    </>
  );
};

const HistoryContainer = ({ route, navigation: { navigate } }: Props) => {
  const { Layout, Colors } = useTheme();
  const user = AuthService.getCurrentUser();
  const { refetch } = route?.params ?? { refetch: false };
  const {
    data,
    isFetching,
    refetch: refetchFn,
  } = userApi.useFetchMeasurementQuery(
    {
      id: user?.uid,
      dateFilter: DatePeriod.LAST_MONTH,
    },
    { refetchOnMountOrArgChange: refetch }
  );

  useEffect(() => {
    if (refetch) {
      refetchFn();
    }
  }, [refetch]);

  return (
    <>
      {!isFetching && !data?.measurements.length ? (
        <View style={[Layout.fill, Layout.colCenter]}>
          <Icon name="inbox" size={35} color={COLORS.darkGray} />
          <Card.Title
            style={[Layout.colCenter]}
            title="No hay informacion para mostrar"
            subtitle="No se han encontrado mediciones para el periodo seleccionado"
            subtitleNumberOfLines={2}
            subtitleStyle={{
              textAlign: 'center',
              fontSize: 14,
            }}
          />
        </View>
      ) : (
        <ScrollView
          style={Layout.fill}
          contentContainerStyle={styles.scrollView}
        >
          <SkeletonView
            template={SkeletonView.templates.TEXT_CONTENT}
            showContent={!isFetching && data?.measurements}
            renderContent={() => (
              <>
                <Text style={styles.title}>Historial de mediciones</Text>
                <Table data={data!.measurements.slice(0, 5)} />
              </>
            )}
            times={9}
          />
        </ScrollView>
      )}
    </>
  );
};

export default HistoryContainer;
