import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import AuthService from '@/Services/modules/auth';

import { Config } from '@/Config';

const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: async (headers) => {
    const user = AuthService.getCurrentUser();
    const token = await user?.getIdToken();
    if (token) {
      headers.set('auth-token', token);
    }

    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
  }
  return result;
};

export const api = createApi({
  reducerPath: 'diabunityApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
