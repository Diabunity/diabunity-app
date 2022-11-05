import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';

import { Emoji } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Emoji, { id: string; name: string }>({
    query: ({ id, name }) => {
      return {
        url: `/users/${
          AuthService.getCurrentUser()?.uid
        }/posts/${id}/reaction/${name}`,
        method: 'DELETE',
        body: {},
      };
    },
  });
