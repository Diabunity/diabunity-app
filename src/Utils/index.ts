import { Measurements } from '@/Services/modules/users';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

const hexToInt = (hex: string): number => {
  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }
  var num = parseInt(hex, 16);
  var maxVal = Math.pow(2, (hex.length / 2) * 8);
  if (num > maxVal / 2 - 1) {
    num = num - maxVal;
  }
  return num;
};

export const hexToBytes = (hex?: string): Array<number> => {
  if (!hex) return [];
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(hexToInt(hex.substr(c, 2)));
  return bytes;
};

export const arraycopy = (
  src: Array<any> | Uint8Array,
  srcPos: number,
  dst: Array<any> | Uint8Array,
  dstPos: number,
  length: number
) => {
  src.slice(srcPos, srcPos + length).forEach((e, i) => (dst[dstPos + i] = e));
};

export const uncomplement = (val: number, bitwidth: number) => {
  var isnegative = val & (1 << (bitwidth - 1));
  var boundary = 1 << bitwidth;
  var minval = -boundary;
  var mask = boundary - 1;
  return isnegative ? minval + (val & mask) : val;
};

export enum DatePeriod {
  LAST_DAY = 'lastDay',
  LAST_WEEK = 'lastDay',
  LAST_MONTH = 'lastMonth',
  LAST_YEAR = 'lastYear',
}

const getDatePeriod = (date: Date, format: string): Date => {
  switch (format) {
    case DatePeriod.LAST_DAY:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    case DatePeriod.LAST_WEEK:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
    case DatePeriod.LAST_MONTH:
      return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    case DatePeriod.LAST_YEAR:
      return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
    default:
      return date;
  }
};

const formatDate = (date: Date): string =>
  `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

const formatHour = (date: Date): string =>
  `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

export const formatDatePeriod = (
  end: Date,
  format: string
): { from: string; to: string } => {
  const start = getDatePeriod(end, format);
  return { from: formatDate(start), to: formatDate(end) };
};

export const getChartDataset = (
  measurements: Measurements | undefined
): LineChartData => {
  if (!measurements) return { datasets: [{ data: [] }], labels: [] };
  const labels = measurements.map((m) => formatHour(new Date(m.timestamp)));
  const data = measurements.map((m) => m.measurement);
  return {
    labels,
    datasets: [{ data }],
  };
};
