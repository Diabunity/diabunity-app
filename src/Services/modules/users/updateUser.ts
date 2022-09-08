import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { User } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<User, User>({
    query: (data) => {
      return {
        url: `/users/${data.id}`,
        method: 'PUT',
        body: data,
      };
    },
  });
