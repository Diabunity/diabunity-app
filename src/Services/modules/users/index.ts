import { api } from '../../api';
import fetchUser from './fetchUser';
import saveUser from './saveUser';
import updateUser from './updateUser';
import fetchMeasurement from './fetchMeasurement';
import saveMeasurement from './saveMeasurement';
import fetchRanking from './fetchRanking';
import saveDeviceData from './saveDeviceData';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchUser: fetchUser(build),
    saveUser: saveUser(build),
    updateUser: updateUser(build),
    fetchMeasurement: fetchMeasurement(build),
    saveMeasurement: saveMeasurement(build),
    fetchRanking: fetchRanking(build),
    saveDeviceData: saveDeviceData(build),
  }),
  overrideExisting: true,
});

type MeasurementEntry = {
  value: number;
  status: MeasurementStatus;
};

type PeriodEntry = {
  value: number;
  status: PeriodInTargetStatus;
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

export enum PeriodInTargetStatus {
  BAD = 0,
  STABLE = 1,
  GOOD = 2,
}

export enum DiabetesType {
  TYPE_1 = 0,
  TYPE_2 = 1,
}

export type Measurement = {
  measurement: number;
  timestamp: Date | string;
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
  verified: boolean;
};

export type Measurements = {
  avg: MeasurementEntry;
  measurements: Array<Measurement>;
  periodInTarget: PeriodEntry;
  totalPages: number;
  totalElements: number;
};

export interface UserRanking {
  username: string;
  picture?: string;
  percentage: number;
}

export interface UserInfo {
  position: number;
}

export interface DeviceData {
  deviceId: string;
  osVersion: string; // e.g "iOS 14.4.2" or "Android 10"
  brand: string; // e.g "Apple" or "xiaomi"
}
