import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { DatePeriod, formatDatePeriod } from '@/Utils';

import { Measurements } from '.';

import moment from 'moment';

export const MAX_AMOUNT_OF_ELEMENTS_PER_PAGE = 10;
const ALL_MEASUREMENT_RESULTS = 32;

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
      let from;
      let to;

      if (dateRange) {
        from = moment(dateRange.from).toISOString();
        to = moment(dateRange.to).toISOString();
      } else {
        const { from: f, to: t } = formatDatePeriod(new Date(), dateFilter);
        from = f.toISOString();
        to = t.toISOString();
      }

      return {
        url: `/users/${id}/measurements`,
        method: 'GET',
        params: {
          from,
          to,
          ...(dateRange && { page: page ?? 0 }),
          size: dateRange
            ? MAX_AMOUNT_OF_ELEMENTS_PER_PAGE
            : ALL_MEASUREMENT_RESULTS,
        },
      };
    },
  });
