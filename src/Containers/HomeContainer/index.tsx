import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Dimensions, View } from 'react-native';
import { SkeletonView } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';
import { RouteProp } from '@react-navigation/native';

import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/Hooks';
import Table, { TableBuilder, TENDENCY } from './Table';
import { styles, COLORS } from './styles';

import AuthService from '@/Services/modules/auth';
import { MeasurementStatus, userApi } from '@/Services/modules/users';
import { SensorLifeStatus } from '@/Services/modules/nfc';
import {
  DatePeriod,
  getChartDataset,
  getSensorLifeTime,
  handleHiddenPoints,
} from '@/Utils';

const HomeContainer = ({
  route,
}: {
  route: RouteProp<
    { params?: { refetch: boolean; sensorLife?: number } },
    'params'
  >;
}) => {
  const { Layout, Colors } = useTheme();
  const user = AuthService.getCurrentUser();
  const { refetch, sensorLife } = route?.params || { refetch: false };
  const {
    data,
    isFetching,
    refetch: refetchFn,
  } = userApi.useFetchMeasurementQuery(
    {
      id: user?.uid,
      dateFilter: DatePeriod.LAST_DAY,
    },
    { refetchOnMountOrArgChange: refetch }
  );

  const measurements = data?.measurements;
  const average = data?.avg || { value: 0, status: MeasurementStatus.OK };
  const periodInTarget = data?.periodInTarget || {
    value: 0,
    status: MeasurementStatus.OK,
  };

  const { age, status = SensorLifeStatus.UNKNOWN } =
    getSensorLifeTime(sensorLife);
  const [currentGlucose = { measurement: 0, status: MeasurementStatus.OK }] =
    measurements?.slice(-1) || [];
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

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
              showContent={!!measurements}
              style={{
                ...Layout.colCenter,
                ...styles.skeleton,
              }}
              renderContent={() => (
                <LineChart
                  data={getChartDataset(measurements)}
                  width={Dimensions.get('window').width} // from react-native
                  height={200}
                  yAxisSuffix="mg/dL"
                  yLabelsOffset={4}
                  xLabelsOffset={4}
                  yAxisInterval={2}
                  hidePointsAtIndex={handleHiddenPoints(measurements?.length)}
                  chartConfig={{
                    propsForBackgroundLines: {
                      stroke: COLORS.darkGray,
                      opacity: '0.5',
                    },
                    backgroundGradientFrom: Colors.white,
                    backgroundGradientTo: Colors.white,
                    decimalPlaces: 0,
                    strokeWidth: 1,
                    color: () => Colors.red,
                    labelColor: () => COLORS.darkGray,
                    propsForDots: {
                      r: '5',
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 10,
                  }}
                  decorator={() => {
                    return tooltipPos.visible ? (
                      <View>
                        <Svg>
                          <Rect
                            x={tooltipPos.x - 15}
                            y={tooltipPos.y + 10}
                            width="40"
                            height="30"
                            fill="black"
                          />
                          <TextSVG
                            x={tooltipPos.x + 5}
                            y={tooltipPos.y + 30}
                            fill={Colors.white}
                            fontSize="16"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {tooltipPos.value}
                          </TextSVG>
                        </Svg>
                      </View>
                    ) : null;
                  }}
                  onDataPointClick={(data) => {
                    let isSamePoint =
                      tooltipPos.x === data.x && tooltipPos.y === data.y;

                    if (isSamePoint) {
                      return;
                    } else {
                      setTooltipPos({
                        x: data.x,
                        value: data.value,
                        y: data.y,
                        visible: true,
                      });
                      setTimeout(() => {
                        setTooltipPos((previousState) => {
                          return {
                            ...previousState,
                            value: data.value,
                            visible: !previousState.visible,
                          };
                        });
                      }, 1000);
                    }
                  }}
                />
              )}
              times={2}
            />
          </ScrollView>
          <SkeletonView
            template={SkeletonView.templates.TEXT_CONTENT}
            showContent={!isFetching}
            renderContent={() => (
              <Table
                data={new TableBuilder()
                  .tendency(TENDENCY.UP)
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
            )}
            times={2}
          />
        </ScrollView>
      )}
    </>
  );
};

export default HomeContainer;
