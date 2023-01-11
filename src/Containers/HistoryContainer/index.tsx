import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Colors, SkeletonView, View } from 'react-native-ui-lib';
import { Card } from 'react-native-paper';
import moment from 'moment';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthService from '@/Services/modules/auth';
import { useTheme } from '@/Hooks';
import { userApi } from '@/Services/modules/users';
import { DatePeriod } from '@/Utils';
import HeaderDatePicker from './HeaderDatePicker';
import Table from './Table';
import { PAGE_DIRECTION } from '@/Constants';
import { NavigatorParams } from '@/Navigators/Application';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
    textAlign: 'center',
  },
  skeleton: {
    padding: 10,
    marginTop: 10,
  },
});

type Props = NativeStackScreenProps<NavigatorParams>;

const HistoryContainer = ({ navigation: { navigate } }: Props) => {
  const { Layout } = useTheme();
  const isFocused = useIsFocused();
  const user = AuthService.getCurrentUser();
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>();
  const [page, setPage] = useState<number>(0);
  const [unmount, setUnmounted] = useState<boolean>(false);
  const { data, isFetching } = userApi.useFetchMeasurementQuery({
    page,
    dateRange,
    id: user?.uid,
    dateFilter: DatePeriod.LAST_WEEK,
  });

  useEffect(() => {
    if (isFocused) {
      setUnmounted(false);
    }
  }, [isFocused]);

  const onDateChange = (dateRange: { from: string; to: string }) => {
    const from = moment(dateRange.from);
    const to = moment(dateRange.to);
    const diffDays = to.diff(from, 'days');
    if (diffDays > 7) {
      setUnmounted(true);
      navigate('WithoutPremium');
    } else {
      setDateRange(dateRange);
      setPage(0);
    }
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
      <Text style={{ ...styles.title, color: Colors.darkGray }}>
        Historial de mediciones
      </Text>
      {!unmount && <HeaderDatePicker onDateChange={onDateChange} />}
      {isFetching ? (
        <SkeletonView
          template={SkeletonView.templates.TEXT_CONTENT}
          style={styles.skeleton}
          times={5}
        />
      ) : !data?.measurements.length ? (
        <View style={[Layout.fill, Layout.colCenter, { marginTop: 50 }]}>
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
        <Table
          data={data}
          currentPage={page}
          onPageChangeSelected={onPageChangeSelected}
        />
      )}
    </ScrollView>
  );
};

export default HistoryContainer;
