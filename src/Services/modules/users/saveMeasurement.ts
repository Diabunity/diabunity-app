import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';

import { Measurements } from '.';

export default (build: EndpointBuilder<any, any, any>) => {
  const user = AuthService.getCurrentUser();
  return build.mutation<Measurements, Measurements>({
    query: (data) => {
      return {
        url: `/users/${user?.uid}/measurements`,
        method: 'POST',
        body: data,
      };
    },
  });
};
