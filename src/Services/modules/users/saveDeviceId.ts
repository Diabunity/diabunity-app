import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { DeviceId } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<void, DeviceId>({
    query: (data) => {
      return {
        url: `/users/${AuthService.getCurrentUser()?.uid}/device_id`,
        method: 'POST',
        body: data,
      };
    },
  });
