import moment from 'moment';
import 'moment/locale/es';
import { capitalizeString, DatePeriod } from '.';
import { DEFAULT_NO_VALUE_SET } from '@/Constants';
import { DiabetesType, DiabetesTypeText } from '@/Services/modules/users';

moment.locale('es');

const defaultAvg = {
  timestamp: 'RESUMEN PROMEDIO - SEMANA COMPLETA',
  data: {
    values: [] as number[],
    max_value: 0,
    labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  },
};

export const handleReportData = (data: any, filter: DatePeriod): any => {
  const clonedObj = JSON.parse(JSON.stringify(data));
  const { user_info, measurements_info } = clonedObj;
  const totalMeasurements = Object.keys(measurements_info.metadata).reduce(
    (acc, key) => {
      return acc + measurements_info.metadata[key];
    },
    0
  );
  const dataWithUserInfoUpdated = {
    ...clonedObj,
    type: getType(filter),
    dateRange: getDateRange(filter),
    user_info: {
      ...user_info,
      age: user_info.age ?? DEFAULT_NO_VALUE_SET,
      weight: user_info.weight ?? DEFAULT_NO_VALUE_SET,
      height: user_info.height ? user_info.height / 100 : DEFAULT_NO_VALUE_SET,
      diabetes_type: DiabetesTypeText[user_info.diabetes_type as DiabetesType],
      glucose_info: {
        ...user_info.glucose_info,
        ...handleGlucoseInfo(user_info.glucose_info),
      },
    },
    measurements_info: {
      ...measurements_info,
      metadata: {
        ...measurements_info.metadata,
        total: totalMeasurements,
        out_of_range: totalMeasurements - measurements_info.metadata.in_range,
      },
      results: measurements_info.results
        .map((m: any) => {
          let maxValue = m.data.reduce(
            (acc: any, d: any) => (d.value > acc ? d.value : acc),
            0
          );
          maxValue =
            maxValue >= user_info.glucose_info.in_range.max
              ? maxValue
              : user_info.glucose_info.in_range.max;
          return {
            ...m,
            timestamp: capitalizeString(
              moment(m.timestamp).format('dddd DD/MM/YYYY')
            ),
            data: {
              values: m.data.map((d: any) => d.value).reverse(),
              max_value: maxValue,
              labels: m.data
                .map((d: any) => moment(d.timestamp).format('HH:mm'))
                .reverse(),
            },
          };
        })
        .reverse(),
    },
  };
  // For weekly reports, we need to calculate the average of the last week to show it in a new chart
  let resultsWithAvg = [];
  defaultAvg.data.max_value = Number(
    dataWithUserInfoUpdated.user_info.glucose_info.in_range.match(
      /\d+(\.\d+)?/g
    )[1]
  );
  if (filter === DatePeriod.LAST_WEEK) {
    resultsWithAvg = dataWithUserInfoUpdated.measurements_info.results.map(
      (m: {
        data: { values: number[]; max_value: number; labels: string[] };
      }) => {
        const avg = Math.round(calculateAvg(m.data.values));
        if (avg > defaultAvg.data.max_value) {
          defaultAvg.data.max_value = avg;
        }
        defaultAvg.data.values.push(avg);
        return {
          ...m,
          data: {
            values: m.data.values,
            max_value: m.data.max_value,
            labels: m.data.labels,
          },
        };
      }
    );
    resultsWithAvg.push(defaultAvg);
    dataWithUserInfoUpdated.measurements_info.results = resultsWithAvg;
  }

  return dataWithUserInfoUpdated;
};

const calculateAvg = (values: number[]) => {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

const handleGlucoseInfo = (glucoseInfo: any) => {
  Object.keys(glucoseInfo).forEach((key) => {
    const { min, max } = glucoseInfo[key];
    if (!min && max) {
      glucoseInfo[key] = `< ${max} mg/dL`;
    } else if (min && !max) {
      glucoseInfo[key] = `> ${min} mg/dL`;
    } else {
      glucoseInfo[key] = `${min} mg/dL a ${max} mg/dL`;
    }
  });
  return glucoseInfo;
};

const getType = (filter: DatePeriod) => {
  switch (filter) {
    case DatePeriod.LAST_DAY:
      return ['diario', 'dia'];
    case DatePeriod.LAST_WEEK:
      return ['semanal', 'semana'];
    default:
      return ['No especificado', 'No especificado'];
  }
};

const getDateRange = (filter: DatePeriod) => {
  switch (filter) {
    case DatePeriod.LAST_DAY:
      return capitalizeString(moment().format('DD/MM/YYYY'));
    case DatePeriod.LAST_WEEK:
      return `${capitalizeString(
        moment().subtract(7, 'days').format('DD/MM/YYYY')
      )} al ${capitalizeString(moment().format('DD/MM/YYYY'))}`;
    default:
      return 'No especificado';
  }
};
