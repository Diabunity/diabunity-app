import { SensorLifeStatus } from '@/Services/modules/nfc';
import { Measurement } from '@/Services/modules/users';
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
  LAST_8_HOURS = 'last8Hours',
  LAST_DAY = 'lastDay',
  LAST_WEEK = 'lastWeek',
  LAST_MONTH = 'lastMonth',
  LAST_YEAR = 'lastYear',
}

export const getDatePeriod = (date: Date, format: string): Date => {
  switch (format) {
    case DatePeriod.LAST_8_HOURS:
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours() - 8
      );
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

export const formatHour = (
  date: Date,
  includeSeconds: boolean = false
): string => {
  const minutes = date.getMinutes();
  const hour = date.getHours();
  let time = `${hour.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  if (includeSeconds) {
    const seconds = date.getSeconds();
    return `${time}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return time;
  }
};

export const formatDatePeriod = (
  end: Date,
  format: string
): { from: Date; to: Date } => {
  const start = getDatePeriod(end, format);
  return { from: setByTimezone(start), to: setByTimezone(end) };
};

export const addMinutes = (date: Date, minutes: number): Date => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const getChartDataset = (
  measurements: Array<Measurement> | undefined
): LineChartData => {
  if (!measurements) return { datasets: [{ data: [] }], labels: [] };
  const orderedArray = measurements.slice().reverse();
  const labels = orderedArray.map((m) => formatHour(new Date(m.timestamp)));
  const data = orderedArray.map((m) => m.measurement);
  return {
    labels,
    datasets: [{ data }],
  };
};

export const handleHiddenPoints = (
  originalLength: number | undefined,
  maxPoints: number = 8
): Array<number> => {
  if (!originalLength || originalLength <= maxPoints) return [];

  return Array.from(Array(originalLength).keys()).filter(
    (num) => num % 3 !== 0
  );
};

export const getSensorLifeTime = (
  sensorLife?: number
): { age: string; status?: number } => {
  if (sensorLife === undefined)
    return { age: 'Desconocido', status: SensorLifeStatus.UNKNOWN };
  const days = sensorLife;
  if (days === 0) return { age: 'Expirado', status: SensorLifeStatus.EXPIRED };

  if (days > 0 && days < 1)
    return { age: 'Menos de 1 dia', status: SensorLifeStatus.ABOUT_TO_EXPIRE };
  return {
    age: `${Math.floor(days)} ${Math.floor(days) === 1 ? 'dia' : 'dias'}`,
    status: days <= 5 ? SensorLifeStatus.GOOD : SensorLifeStatus.ALMOST_NEW,
  };
};

export const setByTimezone = (time: Date): Date => {
  const date: Date = new Date();
  const difference: number = -date.getTimezoneOffset() / 60;

  return new Date(time.setHours(time.getHours() + difference));
};

export const getNameInitials = (
  fullName: string | undefined | null
): string => {
  if (!fullName) return '';
  const names = fullName.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const formatDate = (inputDate: Date) => {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date.toString().padStart(2, '0');

  month = month.toString().padStart(2, '0');

  return `${date}/${month}/${year}`;
};

export const getCurrentMonth = () => {
  const month = new Date().getMonth() + 1;

  return month.toString().padStart(2, '0');
};

export const getRelativeTime = (timestamp: string) => {
  const SECOND = 1000;
  const MINUTE = 60;
  const HOUR = 60;
  const DAY = 24;
  const WEEK = 7;
  const MONTH = 30;
  const YEAR = 365;

  const date = new Date(`${timestamp}Z`).getTime();

  const now = new Date().getTime();

  // The difference between now and created
  const howLongAgo = date - now;
  // Convert to a positive integer
  const time = Math.abs(howLongAgo);

  // Define humanTime and units
  let humanTime, units;

  const DAY_TO_SECONDS = SECOND * MINUTE * HOUR * DAY;

  // If there are years
  if (time > DAY_TO_SECONDS * YEAR) {
    (humanTime = time / (DAY_TO_SECONDS * YEAR)), 10;
    units = Math.round(humanTime) >= 2 ? 'años' : 'año';
  }

  // If there are months
  else if (time > DAY_TO_SECONDS * MONTH) {
    humanTime = time / (DAY_TO_SECONDS * MONTH);
    units = Math.round(humanTime) >= 2 ? 'meses' : 'mes';
  }

  // If there are weeks
  else if (time > DAY_TO_SECONDS * WEEK) {
    humanTime = time / (DAY_TO_SECONDS * WEEK);
    units = 'sem';
  }

  // If there are days
  else if (time > DAY_TO_SECONDS) {
    humanTime = time / DAY_TO_SECONDS;
    units = Math.round(humanTime) >= 2 ? 'dias' : 'dia';
  }

  // If there are hours
  else if (time > SECOND * MINUTE * HOUR) {
    humanTime = time / (SECOND * MINUTE * HOUR);
    units = 'h';
  }

  // If there are minutes
  else if (time > SECOND * MINUTE) {
    humanTime = time / (SECOND * MINUTE);
    units = 'm';
  }

  // Otherwise, use seconds
  else {
    humanTime = time / SECOND;
    units = 's';
  }

  return `${humanTime.toFixed(0)} ${units}`;
};
