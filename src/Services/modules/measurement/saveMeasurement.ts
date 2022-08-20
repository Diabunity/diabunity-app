import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { Measurements } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Measurements, string>({
    query: (id) => `/users/${id}`,
  });
