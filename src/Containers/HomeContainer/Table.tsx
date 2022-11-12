import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Hint, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { SensorLifeStatus } from '@/Services/modules/nfc';
import { useTheme } from '@/Hooks';
import {
  MeasurementStatus,
  PeriodInTargetStatus,
} from '@/Services/modules/users';

import { COLORS as COLORS_THEME } from './styles';

export enum TENDENCY {
  RISING,
  RISING_QUICKLY,
  CHANGING_SLOWLY,
  FAILING,
  FAILING_QUICKLY,
  UNKNOWN,
}

enum ARROW {
  RISING = '\u2197',
  RISING_QUICKLY = '\u2191',
  CHANGING_SLOWLY = '\u2192',
  FAILING = '\u2198',
  FAILING_QUICKLY = '\u2193',
  UNKNOWN = 'Desconocido',
}
interface TableProps {
  data: Row[];
}

interface Row {
  label: string;
  value: string;
  styles?: any;
  hint?: string;
}

const TENDENCY_ARROWS = {
  [TENDENCY.RISING]: ARROW.RISING,
  [TENDENCY.RISING_QUICKLY]: ARROW.RISING_QUICKLY,
  [TENDENCY.CHANGING_SLOWLY]: ARROW.CHANGING_SLOWLY,
  [TENDENCY.FAILING]: ARROW.FAILING,
  [TENDENCY.FAILING_QUICKLY]: ARROW.FAILING_QUICKLY,
  [TENDENCY.UNKNOWN]: ARROW.UNKNOWN,
};

const TENDENCY_COLORS: { [key in TENDENCY]: string } = {
  [TENDENCY.RISING]: '#DB7600',
  [TENDENCY.RISING_QUICKLY]: '#C1272D',
  [TENDENCY.CHANGING_SLOWLY]: '#0EB500',
  [TENDENCY.FAILING]: '#0060B9',
  [TENDENCY.FAILING_QUICKLY]: '#FFE800',
  [TENDENCY.UNKNOWN]: '#666666',
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
  const { Colors } = useTheme();
  const [visible, setVisible] = useState<{ [key: number]: boolean }>({});

  return (
    <View style={{ ...tableStyles.container, ...tableStyles.dropShadow }}>
      {data.map((row, index) => (
        <View key={index} style={tableStyles.row}>
          <Text style={tableStyles.label}>{row.label}</Text>
          <Text style={{ ...tableStyles.value, ...row.styles }}>
            {row.value}
            {row.hint && (
              <View>
                <Hint
                  visible={visible[index]}
                  position={Hint.positions.TOP}
                  offset={15}
                  message={row.hint}
                  color={Colors.red}
                  onBackgroundPress={() =>
                    setVisible((prevState) => ({
                      ...prevState,
                      [index]: false,
                    }))
                  }
                >
                  <View>
                    <Icon
                      style={tableStyles.hintIcon}
                      onPress={() =>
                        setVisible((prevState) => ({
                          ...prevState,
                          [index]: !prevState[index],
                        }))
                      }
                      name="info"
                      size={20}
                      color={Colors.dark}
                    />
                  </View>
                </Hint>
              </View>
            )}
          </Text>
        </View>
      ))}
    </View>
  );
};

const tableStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS_THEME.gray,
    backgroundColor: COLORS_THEME.white,
    marginTop: 15,
  },
  hintIcon: {
    position: 'relative',
    left: 5,
    top: 5,
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
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
    this._data[0].value = TENDENCY_ARROWS[tendency];
    const { fontSize, ...rest } = tableStyles.arrow;
    this._data[0].styles = {
      color: TENDENCY_COLORS[tendency],
      ...rest,
      ...(tendency !== TENDENCY.UNKNOWN && { fontSize }),
    };

    this._data[0].hint =
      tendency === TENDENCY.UNKNOWN
        ? 'Vuelve a medirte para conocer la tendencia'
        : undefined;

    return this;
  }

  periodInTarget(
    percentage: number,
    status: PeriodInTargetStatus
  ): TableBuilder {
    this._data[1].value = Math.round(percentage * 100) + '%';
    this._data[1].styles = { color: PERIOD_IN_TARGET_COLORS[status] };
    return this;
  }

  lastScanMeasure(value: number, status: MeasurementStatus): TableBuilder {
    this._data[2].value = value + ' mg/dL';
    this._data[2].styles = { color: STATUS_COLORS[status] };
    return this;
  }

  average(value: number, status: MeasurementStatus): TableBuilder {
    this._data[3].value = Math.round(value) + ' mg/dL';
    this._data[3].styles = { color: STATUS_COLORS[status] };
    return this;
  }

  sensorLife(days: string, status: SensorLifeStatus): TableBuilder {
    this._data[4].value = days;
    this._data[4].styles = { color: SENSOR_LIFE_COLORS[status] };
    this._data[4].hint =
      status === SensorLifeStatus.UNKNOWN
        ? 'Vuelve a medirte para conocer la vida útil del sensor'
        : undefined;
    return this;
  }

  build(): Row[] {
    return this._data;
  }
}
