import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { Feedback } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Feedback, Partial<Feedback>>({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/feedback`,
        method: 'POST',
        body: data,
      };
    },
  });
