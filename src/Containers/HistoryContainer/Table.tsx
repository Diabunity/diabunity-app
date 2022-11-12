import React from 'react';
import { Hint, Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';

import {
  MeasurementMode,
  Measurements,
  MeasurementStatus,
} from '@/Services/modules/users';

import { useState } from 'react';
import { generateTableStyles } from './styles';
import { setByTimezone, formatDate, formatHour } from '@/Utils';
import Footer from './Footer';
import { useTheme } from '@/Hooks';

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

export default ({
  data,
  currentPage,
  onPageChangeSelected,
}: {
  data?: Measurements;
  currentPage: number;
  onPageChangeSelected: Function;
}) => {
  const [visible, setVisible] = useState<{ [key: string]: boolean }>({});
  const { Colors } = useTheme();
  const styles = generateTableStyles(Colors);

  return (
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
                {item.comments && (
                  <View>
                    <Hint
                      visible={visible[item.timestamp.toString()]}
                      position={Hint.positions.BOTTOM}
                      message={item.comments}
                      offset={15}
                      color={Colors.red}
                      onBackgroundPress={() =>
                        setVisible((prevState) => ({
                          ...prevState,
                          [item.timestamp.toString()]: false,
                        }))
                      }
                    >
                      <View>
                        <Icon
                          onPress={() =>
                            setVisible((prevState) => ({
                              ...prevState,
                              [item.timestamp.toString()]:
                                !prevState[item.timestamp.toString()],
                            }))
                          }
                          name="info"
                          style={styles.hintIcon}
                          size={20}
                          color={Colors.dark}
                        />
                      </View>
                    </Hint>
                  </View>
                )}
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
};
