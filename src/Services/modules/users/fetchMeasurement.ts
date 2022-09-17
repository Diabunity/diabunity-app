import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { DatePeriod, formatDatePeriod } from '@/Utils';
import { Measurements } from '.';

import moment from 'moment';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    Measurements,
    {
      id?: string;
      dateFilter: DatePeriod;
      dateRange?: { from: string; to: string };
      page?: number;
    }
  >({
    query: ({ id, dateFilter, dateRange, page }) => {
      if (dateRange) {
        const from = moment(dateRange.from).toISOString();
        const to = moment(dateRange.to).toISOString();

        return {
          url: `/users/${id}/measurements`,
          method: 'GET',
          params: {
            from,
            to,
            page: page ?? 0,
            size: 10,
          },
        };
      }

      const { from, to } = formatDatePeriod(new Date(), dateFilter);
      return {
        url: `/users/${id}/measurements`,
        method: 'GET',
        params: { from: from.toISOString(), to: to.toISOString() },
      };
    },
  });
