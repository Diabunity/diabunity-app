import React from 'react';
import { Text } from 'react-native';
import { View } from 'react-native-ui-lib';

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

const Header = ({ tendency }: HeaderProps) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 14 }}>
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          width: '50%',
          paddingLeft: 12,
          textTransform: 'uppercase',
          color: '#C1272D', // TODO: Choose color depending on tendency
          fontWeight: '700',
        }}
      >
        Tendencia
      </Text>
      <Text
        style={{
          width: '50%',
          color: '#C1272D', // TODO: Choose color depending on tendency
          fontWeight: '700',
          fontSize: 28,
          lineHeight: 24,
          paddingLeft: 15,
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
  // TODO: Choose colors dependending on tendency
  return (
    <>
      <Header tendency={tendency} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          borderWidth: 0.5,
          borderColor: 'rgba(0, 0, 0, 0.12)',
          marginTop: 15,
        }}
      >
        {data.map((row, index) => (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderBottomWidth: 0.5,
              borderColor: 'rgba(0, 0, 0, 0.12)',
            }}
          >
            <Text
              style={{
                width: '50%',
                fontWeight: '600',
                color: 'rgba(0, 0, 0, 0.87)',
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              {row.label}
            </Text>
            <Text
              style={{
                width: '50%',
                fontWeight: '600',
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

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
    this._data[0].value = percentage + '%';
    return this;
  }

  lastScanMeasure(value: number): TableBuilder {
    this._data[1].value = value + ' ml/dL';
    return this;
  }

  average(value: number): TableBuilder {
    this._data[2].value = value + ' ml/dL';
    return this;
  }

  sensorLife(days: number): TableBuilder {
    this._data[3].value = days + ' días';
    return this;
  }

  build(): Row[] {
    return this._data;
  }
}
