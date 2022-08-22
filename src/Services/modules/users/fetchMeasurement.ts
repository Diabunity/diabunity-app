import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { Measurements } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Measurements, { id?: string; from: string; to: string }>({
    query: ({ id, from, to }) => {
      return {
        url: `/users/${id}/measurements`,
        method: 'GET',
        params: { from, to },
      };
    },
  });
