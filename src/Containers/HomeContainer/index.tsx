import React, { useEffect } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { SkeletonView } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '@/Hooks';
import Table, { TableBuilder, TENDENCY } from './Table';
import { styles, COLORS } from './styles';

import AuthService from '@/Services/modules/auth';
import {
  MeasurementStatus,
  PeriodInTargetStatus,
  userApi,
} from '@/Services/modules/users';
import { SensorLifeStatus } from '@/Services/modules/nfc';
import { NavigatorParams } from '@/Navigators/Application';
import { DatePeriod, getSensorLifeTime } from '@/Utils';
import { FormButton, Tips } from '@/Components';
import MedicalReportContainer from '../MedicalReportContainer';
import LastDayChart from '@/Components/LastDayChart';

type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<
    {
      params?: {
        refetch: string | null;
        sensorLife?: number;
        tendency: TENDENCY;
      };
    },
    'params'
  >;
};

const HomeContainer = ({ route, navigation: { navigate } }: Props) => {
  const { Layout, Colors } = useTheme();
  const user = AuthService.getCurrentUser();
  const { data: userData } = userApi.useFetchUserQuery(user?.uid, {
    refetchOnMountOrArgChange: true,
  });

  const { refetch, sensorLife, tendency } = route?.params || { refetch: null };

  const {
    data,
    isFetching,
    refetch: refetchFn,
  } = userApi.useFetchMeasurementQuery(
    {
      id: user?.uid,
      dateFilter: DatePeriod.LAST_8_HOURS,
    },
    { refetchOnMountOrArgChange: !!refetch }
  );

  const measurements = data?.measurements;
  const average = data?.avg || { value: 0, status: MeasurementStatus.OK };
  const periodInTarget = data?.periodInTarget || {
    value: 0,
    status: PeriodInTargetStatus.GOOD,
  };

  const { age, status = SensorLifeStatus.UNKNOWN } =
    getSensorLifeTime(sensorLife);
  const [currentGlucose = { measurement: 0, status: MeasurementStatus.OK }] = [
    measurements?.[0],
  ];

  useEffect(() => {
    if (refetch) {
      refetchFn();
    }
  }, [refetch]);

  return (
    <>
      {!isFetching && !measurements?.length ? (
        <View style={[Layout.fill, Layout.colCenter]}>
          <Icon name="inbox" size={35} color={COLORS.darkGray} />
          <Card.Title
            style={[Layout.colCenter]}
            title="No hay informacion para mostrar"
            subtitle="No se han encontrado mediciones"
            subtitleStyle={styles.card}
          />
          <FormButton
            label="Empeza a medirte"
            onPress={() => navigate('Add')}
            noMarginBottom
            backgroundColor={Colors.red}
          />
        </View>
      ) : (
        <ScrollView
          style={Layout.fill}
          contentContainerStyle={styles.scrollView}
        >
          <Text style={styles.title}>Últimas 24 horas</Text>
          <ScrollView horizontal style={{ marginTop: 10 }}>
            <SkeletonView
              template={SkeletonView.templates.TEXT_CONTENT}
              showContent={!!measurements && !isFetching}
              style={{
                ...Layout.colCenter,
                ...styles.skeleton,
              }}
              renderContent={() => <LastDayChart measurements={measurements} />}
              times={2}
            />
          </ScrollView>
          <SkeletonView
            template={SkeletonView.templates.TEXT_CONTENT}
            showContent={!isFetching}
            renderContent={() => (
              <View>
                <Table
                  data={new TableBuilder()
                    .tendency(tendency ?? TENDENCY.UNKNOWN)
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
                <MedicalReportContainer
                  data={data}
                  name={user?.displayName}
                  user={userData}
                  navigate={navigate}
                  sensorLife={sensorLife}
                />
                <Tips />
              </View>
            )}
            times={2}
          />
        </ScrollView>
      )}
    </>
  );
};

export default HomeContainer;
