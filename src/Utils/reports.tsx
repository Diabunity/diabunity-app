import moment from 'moment';
import 'moment/locale/es';
import { capitalizeString, DatePeriod } from '.';

moment.locale('es');

export const handleReportData = (data: any, filter: DatePeriod): any => {
  //TODO: Updadate data type and remove any
  const clonedObj = JSON.parse(JSON.stringify(data));
  const { user_info } = clonedObj;
  const totalMeasurements = Object.keys(
    user_info.measurements_info.metadata.quantity
  ).reduce((acc, key) => {
    return acc + user_info.measurements_info.metadata.quantity[key];
  }, 0);
  const dataWithUserInfoUpdated = {
    ...clonedObj,
    type: getType(filter),
    dateRange: getDateRange(filter),
    user_info: {
      ...user_info,
      age: user_info.age ? user_info.age : 'No especificado',
      weight: user_info.weight ? user_info.weight : 'No especificado',
      height: user_info.height ? user_info.height / 100 : 'No especificado',
      glucose_info: {
        ...user_info.glucose_info,
        ...handleGlucoseInfo(user_info.glucose_info),
      },
      measurements_info: {
        ...user_info.measurements_info,
        metadata: {
          ...user_info.measurements_info.metadata,
          quantity: {
            ...user_info.measurements_info.metadata.quantity,
            total: totalMeasurements,
            out_of_range:
              totalMeasurements -
              user_info.measurements_info.metadata.quantity.in_range,
          },
        },
        results: user_info.measurements_info.results.map((m: any) => {
          return {
            ...m,
            timestamp: capitalizeString(
              moment(m.timestamp * 1000).format('dddd DD/MM/YYYY')
            ),
            data: {
              values: m.data.map((d: any) => d.value),
              max_value: m.data.reduce(
                (acc: any, d: any) => (d.value > acc ? d.value : acc),
                0
              ),
              labels: m.data.map((d: any) =>
                moment(d.timestamp * 1000).format('HH:mm')
              ),
            },
          };
        }),
      },
    },
  };
  return dataWithUserInfoUpdated;
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
      )} - ${capitalizeString(moment().format('DD/MM/YYYY'))}`;
    default:
      return 'No especificado';
  }
};
