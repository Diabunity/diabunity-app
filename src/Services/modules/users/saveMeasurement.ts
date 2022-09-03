import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';

import { Measurement } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Array<Measurement>, Array<Measurement>>({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/measurements`,
        method: 'POST',
        body: data,
      };
    },
  });
