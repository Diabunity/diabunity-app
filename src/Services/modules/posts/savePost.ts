import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';

import { Post } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<
    Post,
    Omit<Post, 'id' | 'timestamp' | 'userId' | 'qtyComments' | 'username'>
  >({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/posts`,
        method: 'POST',
        body: data,
      };
    },
  });
