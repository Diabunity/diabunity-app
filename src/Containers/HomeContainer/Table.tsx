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

interface HeaderProps {
  tendency: TENDENCY;
}

interface TableProps {
  tendency: TENDENCY;
  data: Row[];
}

interface Row {
  label: string;
  value: string;
}

const COLORS: { [key in TENDENCY]: string } = {
  [TENDENCY.UP]: '#C1272D',
  [TENDENCY.DOWN]: 'green',
  [TENDENCY.EQUAL]: '#C1272D', // TODO: Which color should be?
};

const Header = ({ tendency }: HeaderProps) => {
  return (
    <View style={headerStyles.container}>
      <Text
        style={{
          color: COLORS[tendency],
          ...headerStyles.text,
        }}
      >
        Tendencia
      </Text>
      <Text
        style={{
          color: COLORS[tendency],
          ...headerStyles.arrow,
        }}
      >
        {tendency === TENDENCY.UP
          ? ARROW.UP
          : tendency === TENDENCY.DOWN
          ? ARROW.DOWN
          : ARROW.EQUAL}
      </Text>
    </View>
  );
};

export default ({ tendency, data }: TableProps) => {
  return (
    <>
      <Header tendency={tendency} />
      <View style={tableStyles.container}>
        {data.map((row, index) => (
          <View key={index} style={tableStyles.row}>
            <Text style={tableStyles.label}>{row.label}</Text>
            <Text style={tableStyles.value}>{row.value}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 14,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    width: '50%',
    paddingLeft: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  arrow: {
    width: '50%',
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 24,
    paddingLeft: 15,
  },
});

const tableStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS_THEME.gray,
    marginTop: 15,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: COLORS_THEME.gray,
  },
  label: {
    width: '50%',
    fontWeight: '600',
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
      { label: 'Periodo en objetivo', value: '' },
      { label: 'Último escaneo', value: '' },
      { label: 'Promedio', value: '' },
      { label: 'Vida útil del sensor', value: '' },
    ];
  }

  periodInTarget(percentage: number): TableBuilder {
    // TODO: If percentage is greater than XX%, then color the value red
    // TODO: If not, color it green
    this._data[0].value = percentage + '%';
    return this;
  }

  lastScanMeasure(value: number): TableBuilder {
    // TODO: If value is greater than the CAP set by the user, then color the value red
    // TODO: If not, color it green
    this._data[1].value = value + ' ml/dL';
    return this;
  }

  average(value: number): TableBuilder {
    // TODO: If value is greater than the CAP set by the user, then color the value red
    // TODO: If not, color it green
    this._data[2].value = value + ' ml/dL';
    return this;
  }

  sensorLife(days: number): TableBuilder {
    // TODO: If amount of days is less than X days, then color the value red
    // TODO: If not, color it green
    this._data[3].value = days + ' días';
    return this;
  }

  build(): Row[] {
    return this._data;
  }
}
