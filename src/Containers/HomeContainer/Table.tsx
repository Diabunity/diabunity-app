import { SensorLifeStatus } from '@/Services/modules/nfc';
import {
  MeasurementStatus,
  PeriodInTargetStatus,
} from '@/Services/modules/users';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { COLORS as COLORS_THEME } from './styles';

export enum TENDENCY {
  UP,
  DOWN,
  EQUAL,
}

enum ARROW {
  UP = '\u2191',
  EQUAL = '\u2192',
  DOWN = '\u2193',
}
interface TableProps {
  data: Row[];
}

interface Row {
  label: string;
  value: string;
  styles?: any;
}

const TENDENCY_COLORS: { [key in TENDENCY]: string } = {
  [TENDENCY.UP]: '#C1272D',
  [TENDENCY.DOWN]: '#0060B9',
  [TENDENCY.EQUAL]: '#0EB500',
};

const SENSOR_LIFE_COLORS: { [key in SensorLifeStatus]: string } = {
  [SensorLifeStatus.UNKNOWN]: '#666666',
  [SensorLifeStatus.EXPIRED]: '#C1272D',
  [SensorLifeStatus.ABOUT_TO_EXPIRE]: '#DB7600',
  [SensorLifeStatus.GOOD]: '#0060B9',
  [SensorLifeStatus.ALMOST_NEW]: '#0EB500',
};

const STATUS_COLORS: { [key in MeasurementStatus]: string } = {
  [MeasurementStatus.LOW]: '#0060B9',
  [MeasurementStatus.OK]: '#0EB500',
  [MeasurementStatus.HIGH]: '#DB7600',
  [MeasurementStatus.SUPER_HIGH]: '#C1272D',
};

const PERIOD_IN_TARGET_COLORS: { [key in PeriodInTargetStatus]: string } = {
  [PeriodInTargetStatus.BAD]: '#C1272D',
  [PeriodInTargetStatus.STABLE]: '#DB7600',
  [PeriodInTargetStatus.GOOD]: '#0EB500',
};

export default ({ data }: TableProps) => {
  return (
    <>
      <View style={tableStyles.container}>
        {data.map((row, index) => (
          <View key={index} style={tableStyles.row}>
            <Text style={tableStyles.label}>{row.label}</Text>
            <Text style={{ ...tableStyles.value, ...row.styles }}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

const tableStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS_THEME.gray,
    marginTop: 15,
  },
  arrow: {
    fontSize: 28,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 0.5,
    borderColor: COLORS_THEME.gray,
  },
  label: {
    width: '50%',
    fontWeight: '700',
    color: COLORS_THEME.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  value: {
    width: '50%',
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export class TableBuilder {
  private readonly _data: Row[];

  constructor() {
    this._data = [
      { label: 'TENDENCIA', value: '' },
      { label: 'Periodo en objetivo', value: '' },
      { label: 'Último escaneo', value: '' },
      { label: 'Promedio', value: '' },
      { label: 'Vida útil del sensor', value: '' },
    ];
  }

  tendency(tendency: TENDENCY): TableBuilder {
    this._data[0].value =
      tendency === TENDENCY.UP
        ? ARROW.UP
        : tendency === TENDENCY.DOWN
        ? ARROW.DOWN
        : ARROW.EQUAL;
    this._data[0].styles = {
      color: TENDENCY_COLORS[tendency],
      ...tableStyles.arrow,
    };

    return this;
  }

  periodInTarget(
    percentage: number,
    status: PeriodInTargetStatus
  ): TableBuilder {
    this._data[1].value = percentage * 100 + '%';
    this._data[1].styles = { color: PERIOD_IN_TARGET_COLORS[status] };
    return this;
  }

  lastScanMeasure(value: number, status: MeasurementStatus): TableBuilder {
    this._data[2].value = value + ' mg/dL';
    this._data[2].styles = { color: STATUS_COLORS[status] };
    return this;
  }

  average(value: number, status: MeasurementStatus): TableBuilder {
    this._data[3].value = value + ' mg/dL';
    this._data[3].styles = { color: STATUS_COLORS[status] };
    return this;
  }

  sensorLife(days: string, status: SensorLifeStatus): TableBuilder {
    this._data[4].value = days;
    this._data[4].styles = { color: SENSOR_LIFE_COLORS[status] };
    return this;
  }

  build(): Row[] {
    return this._data;
  }
}
