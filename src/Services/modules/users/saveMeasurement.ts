import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { TENDENCY } from '@/Containers/HomeContainer/Table';

import { Measurement } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<
    { measurements: Array<Measurement>; tendency?: TENDENCY },
    { measurements: Array<Measurement>; trend_history: number[] }
  >({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/measurements`,
        method: 'POST',
        body: data,
      };
    },
  });
