import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { DatePeriod, formatDatePeriod } from '@/Utils';
import { Measurements } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Measurements, { id?: string; dateFilter: DatePeriod }>({
    query: ({ id, dateFilter }) => {
      const { from, to } = formatDatePeriod(new Date(), dateFilter);
      return {
        url: `/users/${id}/measurements`,
        method: 'GET',
        params: { from: from.toISOString(), to: to.toISOString() },
      };
    },
  });
