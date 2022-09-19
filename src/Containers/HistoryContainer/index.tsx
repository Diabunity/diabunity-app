import React, { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { NavigatorParams } from '@/Navigators/Application';
import AuthService from '@/Services/modules/auth';
import { Card } from 'react-native-paper';
import { useTheme } from '@/Hooks';
import {
  MeasurementMode,
  Measurements,
  MeasurementStatus,
  userApi,
} from '@/Services/modules/users';
import { DatePeriod, formatDate, formatHour } from '@/Utils';
import { ScrollView, Text } from 'react-native';
import { styles } from './styles';
import { SkeletonView, View } from 'react-native-ui-lib';

import HeaderDatePicker from './HeaderDatePicker';
import Footer, { PAGE_DIRECTION } from './Footer';

type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<
    { params?: { refetch: boolean; sensorLife?: number } },
    'params'
  >;
};

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

const Table = ({
  data,
  currentPage,
  onPageChangeSelected,
}: {
  data?: Measurements;
  currentPage: number;
  onPageChangeSelected: Function;
}) => (
  <View style={{ ...styles.container, ...styles.dropShadow }}>
    {data!.measurements.map((item, index) => {
      const currentItemDate = new Date(item.timestamp);

      return (
        <View key={index} style={styles.row}>
          <View style={styles.dateAndSourceContainer}>
            <Text style={styles.dateAndSource}>
              {formatDate(currentItemDate)}
            </Text>
            <Text style={styles.dateAndSource}>
              {formatHour(currentItemDate, true)}hs
            </Text>
            <Text style={styles.dateAndSource}>
              {MEASUREMENT_LABELS[item.source]}
            </Text>
          </View>
          <Text
            style={{
              ...styles.value,
              color: STATUS_COLORS[item.status!],
            }}
          >
            {item.measurement} mg/dL
          </Text>
          <Text
            style={{
              ...styles.value,
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
);

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
      dateFilter: DatePeriod.LAST_WEEK,
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
    <ScrollView style={Layout.fill} contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>Historial de mediciones</Text>
      <HeaderDatePicker onDateChange={onDateChange} />
      {!isFetching && !data?.measurements.length ? (
        <View style={[Layout.fill, Layout.colCenter, { marginTop: 25 }]}>
          <Card.Title
            style={[Layout.colCenter]}
            title="No hay informacion para mostrar"
            titleStyle={{ textAlign: 'center' }}
            subtitle="No se han encontrado mediciones para el periodo seleccionado"
            subtitleNumberOfLines={2}
            subtitleStyle={{
              textAlign: 'center',
              fontSize: 14,
            }}
          />
        </View>
      ) : (
        <SkeletonView
          template={SkeletonView.templates.TEXT_CONTENT}
          showContent={!isFetching && data?.measurements}
          renderContent={() => (
            <Table
              data={data}
              currentPage={page}
              onPageChangeSelected={onPageChangeSelected}
            />
          )}
          times={9}
        />
      )}
    </ScrollView>
  );
};

export default HistoryContainer;
