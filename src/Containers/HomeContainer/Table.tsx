import { MeasurementStatus } from '@/Services/modules/users';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { styles } from '../OnboardingContainer/styles';

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
  [TENDENCY.DOWN]: 'green',
  [TENDENCY.EQUAL]: '#C1272D', // TODO: Which color should be?
};

const STATUS_COLORS: { [key in MeasurementStatus]: string } = {
  [MeasurementStatus.LOW]: '#0EB500',
  [MeasurementStatus.OK]: '#DB7600',
  [MeasurementStatus.HIGH]: '#C1272D',
  [MeasurementStatus.SUPER_HIGH]: '#C1272D',
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

  periodInTarget(percentage: number, status: MeasurementStatus): TableBuilder {
    this._data[1].value = percentage + '%';
    this._data[1].styles = { color: STATUS_COLORS[status] };
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

  sensorLife(days: number): TableBuilder {
    // TODO: If amount of days is less than X days, then color the value red
    // TODO: If not, color it green
    this._data[4].value = days + ' días';
    return this;
  }

  build(): Row[] {
    return this._data;
  }
}
