import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { useTheme } from '@/Hooks';
import { MeasurementStatus } from '@/Services/modules/users';
import { STATUS_COLORS } from '@/Containers/HomeContainer/Table';

interface Props {
  measurement: number;
  status: MeasurementStatus;
}

const LastMeasurement = ({ measurement, status }: Props) => {
  const { Layout, Colors } = useTheme();
  const measurementValue = measurement >= 0 ? Math.round(measurement) : '-';
  return (
    <DropShadow
      style={{
        ...styles.dropShadow,
        shadowColor: Colors.dark,
      }}
    >
      <View
        style={[
          Layout.rowCenter,
          styles.container,
          { backgroundColor: STATUS_COLORS[status] },
        ]}
      >
        <Text style={{ ...styles.text, color: Colors.white }}>
          ÚLTIMA MEDICIÓN
        </Text>
        <Text style={{ ...styles.text, color: Colors.white, fontSize: 20 }}>
          {measurementValue} mg/dL
        </Text>
      </View>
    </DropShadow>
  );
};

LastMeasurement.defaultProps = {
  measurement: -1,
  status: MeasurementStatus.OK,
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 3,
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 70,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LastMeasurement;
