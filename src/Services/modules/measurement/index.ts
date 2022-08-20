import { api } from '../../api';
import fetchMeasurement from './fetchMeasurement';
import saveMeasurement from './saveMeasurement';

export const measurementApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchMeasurement: fetchMeasurement(build),
    saveMeasurement: saveMeasurement(build),
  }),
  overrideExisting: false,
});

export const { useLazyFetchMeasurementQuery } = measurementApi;

enum MeasurementSource {
  MANUAL = 0,
  NFC = 1,
}

type Measurement = {
  measurement: number;
  timestamp: Date;
  source: MeasurementSource;
};

export type Measurements = Array<Measurement>;
