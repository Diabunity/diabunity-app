import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { Post } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    { posts: Post[]; paging: { total_pages: number; total_elements: number } },
    string | undefined
  >({
    query: (id) => `/posts/${id}`,
  });
