import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { User } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<User, Partial<User>>({
    query: (data) => {
      return {
        url: '/users',
        method: 'POST',
        body: data,
      };
    },
  });
