import React, { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { NavigatorParams } from '@/Navigators/Application';
import AuthService from '@/Services/modules/auth';
import Icon from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useTheme } from '@/Hooks';
import {
  MeasurementMode,
  Measurements,
  MeasurementStatus,
  userApi,
} from '@/Services/modules/users';
import { DatePeriod, formatDate, formatHour, getDatePeriod } from '@/Utils';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { styles } from './styles';
import { SkeletonView, View } from 'react-native-ui-lib';
import DatePicker from 'react-native-date-ranges';
import moment from 'moment';

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

enum PAGE_DIRECTION {
  NEXT = 'NEXT',
  PREV = 'PREV',
}

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
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.2)',
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

const MEASUREMENT_LABELS: { [key in MeasurementMode]: string } = {
  [MeasurementMode.MANUAL]: 'Manual',
  [MeasurementMode.SENSOR]: 'FreeStyle',
};

const HeaderDatePicker = ({ onDateChange }: { onDateChange: Function }) => {
  const { Colors } = useTheme();
  const dateFormat = 'DD ' + '\\d\\e ' + 'MMMM' + ', YYYY';
  const placeHolder = {
    startDate: moment(getDatePeriod(new Date(), DatePeriod.LAST_WEEK)).format(
      dateFormat
    ),
    endDate: moment(new Date()).format(dateFormat),
  };

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
          placeholderText: { fontSize: 16 },
          headerStyle: { backgroundColor: Colors.red },
          headerDateTitle: { fontSize: 16 },
          contentText: { fontSize: 16 },
        }}
        placeholder={`${placeHolder.startDate} → ${placeHolder.endDate}`}
        outFormat={dateFormat}
        headFormat={dateFormat}
        selectedBgColor={Colors.red}
        mode={'range'}
        ButtonText="Seleccionar"
        ButtonStyle={{}}
        markText=" "
        clearStart="Desde"
        clearEnd="Hasta"
        onConfirm={(data: { startDate: string; endDate: string }) => {
          onDateChange({
            from: data.startDate.replaceAll('/', ''),
            to: data.endDate.replaceAll('/', ''),
          });
        }}
      />
    </View>
  );
};

const Footer = ({
  pages,
  currentPage,
  totalElements,
  onPageChangeSelected,
}: {
  pages: number;
  currentPage: number;
  totalElements: number;
  onPageChangeSelected: Function;
}) => {
  const isLeftChevronEnabled = currentPage > 0;
  const isRightChevronEnabled = currentPage < pages - 1;
  const from = currentPage * 10 + 1;
  const to = Math.min((currentPage + 1) * 10, totalElements);
  return (
    <View style={{ ...tableStyles.row, ...tableStyles.pageInfoContainer }}>
      <Text style={tableStyles.index}>
        {from}-{to} de {totalElements}
      </Text>
      <Text
        style={{
          marginLeft: 38,
          ...tableStyles.index,
          ...tableStyles.chevron,
          ...(isLeftChevronEnabled
            ? { ...tableStyles.enabled }
            : { ...tableStyles.disabled }),
        }}
        onPress={
          isLeftChevronEnabled
            ? () => onPageChangeSelected(PAGE_DIRECTION.PREV)
            : undefined
        }
      >
        &#10094;
      </Text>
      <Text
        style={{
          marginLeft: 42,
          ...tableStyles.index,
          ...tableStyles.chevron,
          ...(isRightChevronEnabled
            ? { ...tableStyles.enabled }
            : { ...tableStyles.disabled }),
        }}
        onPress={
          isRightChevronEnabled
            ? () => onPageChangeSelected(PAGE_DIRECTION.NEXT)
            : undefined
        }
      >
        &#10095;
      </Text>
    </View>
  );
};

const Table = ({
  data,
  currentPage,
  onDateChange,
  onPageChangeSelected,
}: {
  data?: Measurements;
  currentPage: number;
  onDateChange: Function;
  onPageChangeSelected: Function;
}) => {
  return (
    <>
      <HeaderDatePicker onDateChange={onDateChange} />
      <View style={{ ...tableStyles.container, ...tableStyles.dropShadow }}>
        {data!.measurements.map((item, index) => {
          const currentItemDate = new Date(item.timestamp);

          return (
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
                  {formatDate(currentItemDate)}
                </Text>
                <Text style={tableStyles.dateAndSource}>
                  {formatHour(currentItemDate, true)}hs
                </Text>
                <Text style={tableStyles.dateAndSource}>
                  {MEASUREMENT_LABELS[item.source]}
                </Text>
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
          );
        })}
        <Footer
          pages={data!.totalPages}
          currentPage={currentPage}
          totalElements={data!.totalElements}
          onPageChangeSelected={onPageChangeSelected}
        />
      </View>
    </>
  );
};

const HistoryContainer = ({ route, navigation: { navigate } }: Props) => {
  const { Layout } = useTheme();
  const user = AuthService.getCurrentUser();
  const { refetch } = route?.params ?? { refetch: false };
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>();
  const [page, setPage] = useState<number>(0);
  const {
    data,
    isFetching,
    refetch: refetchFn,
  } = userApi.useFetchMeasurementQuery(
    {
      page,
      dateRange,
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

  const onDateChange = (dateRange: { from: string; to: string }) => {
    setDateRange(dateRange);
    setPage(0);
  };

  const onPageChangeSelected = (direction: PAGE_DIRECTION) => {
    if (direction === PAGE_DIRECTION.NEXT) {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };

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
                <Table
                  data={data}
                  currentPage={page}
                  onDateChange={onDateChange}
                  onPageChangeSelected={onPageChangeSelected}
                />
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
