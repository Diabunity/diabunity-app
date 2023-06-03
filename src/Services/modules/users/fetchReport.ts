import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { DatePeriod, formatDatePeriod } from '@/Utils';
import { MedicalReport } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    MedicalReport,
    {
      id?: string;
      dateFilter: DatePeriod;
    }
  >({
    query: ({ id, dateFilter }) => {
      const { from: f, to: t } = formatDatePeriod(new Date(), dateFilter);
      const from = f.toISOString();
      const to = t.toISOString();
      return {
        url: `/users/${id}/measurements/report`,
        method: 'GET',
        params: {
          from,
          to,
        },
      };
    },
  });
