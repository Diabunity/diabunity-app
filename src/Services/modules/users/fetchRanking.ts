import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { getCurrentMonth } from '@/Utils';
import { UserInfo, UserRanking } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<{ ranking: UserRanking[]; user_info: UserInfo | null }, void>({
    query: () => `/ranking/${getCurrentMonth()}`,
  });
