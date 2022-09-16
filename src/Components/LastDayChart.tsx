import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';
import { getChartDataset, handleHiddenPoints } from '@/Utils';
import { useTheme } from '@/Hooks';
import { Measurement } from '@/Services/modules/users';

const COLORS = {
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
  white: '#ffffff',
};

const LastDayChart = ({
  measurements,
}: {
  measurements: Measurement[] | undefined;
}) => {
  const { Colors } = useTheme();

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  return (
    <LineChart
      data={getChartDataset(measurements)}
      width={Dimensions.get('window').width} // from react-native
      height={200}
      yAxisSuffix="mg/dL"
      yLabelsOffset={4}
      xLabelsOffset={4}
      fromZero
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
        let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

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
  );
};

export default LastDayChart;
