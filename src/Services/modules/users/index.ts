import { api } from '../../api';
import fetchUser from './fetchUser';
import saveUser from './saveUser';
import fetchMeasurement from './fetchMeasurement';
import saveMeasurement from './saveMeasurement';


export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchUser: fetchUser(build),
    saveUser: saveUser(build),
    fetchMeasurement: fetchMeasurement(build),
    saveMeasurement: saveMeasurement(build),

  }),
  overrideExisting: false,
});

type MeasurementEntry = {
  value: number;
  status: MeasurementStatus;
};

export enum MeasurementMode {
  MANUAL = 0,
  SENSOR = 1,
}

export enum MeasurementStatus {
  LOW = 0,
  OK = 1,
  HIGH = 2,
  SUPER_HIGH = 3,
}

export type Measurement = {
  measurement: number;
  timestamp: Date;
  source: MeasurementMode;
  comments?: string;
  status?: MeasurementStatus;
};


export const { useLazyFetchUserQuery } = userApi;

export type User = {
  id?: string;
  diabetes_type: number;
  birth_date: Date;
  on_boarding: boolean;
  weight: number;
  height: number;
  glucose_min: number;
  glucose_max: number;
};

export type Measurements = {
  avg: MeasurementEntry;
  measurements: Array<Measurement>;
  periodInTarget: MeasurementEntry;
};
