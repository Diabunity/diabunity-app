import { api } from '../../api';
import fetchUser from './fetchUser';
import saveUser from './saveUser';
import updateUser from './updateUser';
import fetchMeasurement from './fetchMeasurement';
import saveMeasurement from './saveMeasurement';
import fetchRanking from './fetchRanking';
import fetchReport from './fetchReport';
import saveDeviceData from './saveDeviceData';
import saveFeedback from './saveFeedback';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchUser: fetchUser(build),
    saveUser: saveUser(build),
    updateUser: updateUser(build),
    fetchMeasurement: fetchMeasurement(build),
    saveMeasurement: saveMeasurement(build),
    fetchRanking: fetchRanking(build),
    fetchReport: fetchReport(build),
    saveDeviceData: saveDeviceData(build),
    saveFeedback: saveFeedback(build),
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
export const DiabetesTypeText = {
  [DiabetesType.TYPE_1]: 'Tipo 1',
  [DiabetesType.TYPE_2]: 'Tipo 2',
};

export enum SubscriptionType {
  FREE = 0,
  PREMIUM = 1,
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
  diabetes_type: DiabetesType;
  birth_date: Date;
  on_boarding: boolean;
  weight: number;
  height: number;
  glucose_min: number;
  glucose_max: number;
  verified: boolean;
  subscription: Subscription;
};

export type Measurements = {
  avg: MeasurementEntry;
  measurements: Array<Measurement>;
  periodInTarget: PeriodEntry;
  totalPages: number;
  totalElements: number;
  measurementTracing: MeasurementTracing[];
};

export type MeasurementTracing = {
  count: number;
  source: MeasurementMode;
};

export type Metadata = {
  key: string;
  value: number;
};

export interface Subscription {
  metadata: Metadata[] | Record<string, number>;
  subscription_type: SubscriptionType;
}
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

export type Range = {
  min?: number;
  max?: number;
};

export type GlucoseInfo = {
  low: Range;
  in_range: Range;
  high: Range;
  hyper: Range;
};

export type MeasurementsInfoResults = {
  timestamp: number;
  data: Array<{ timestamp: number; value: number }>;
};
export type MeasurementsInfo = {
  metadata: {
    low: number;
    in_range: number;
    high: number;
    hyper: number;
  };
  results: MeasurementsInfoResults[];
};
export interface MedicalReport {
  user_info: Partial<User> & {
    age: number;
    glucose_info: GlucoseInfo;
  };
  measurements_info: MeasurementsInfo;
}

export enum FeedbackStars {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export type Feedback = {
  comment: string;
  stars: FeedbackStars;
  timestamp: Date;
};
