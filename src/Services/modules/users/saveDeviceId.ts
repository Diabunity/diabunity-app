import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { DeviceData } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<void, DeviceData>({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/devices`,
        method: 'POST',
        body: data,
      };
    },
  });
