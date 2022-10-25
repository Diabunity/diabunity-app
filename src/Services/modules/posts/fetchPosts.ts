import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { Post } from '.';

const MAX_AMOUNT_OF_ELEMENTS_PER_PAGE = 10;

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    { posts: Post[]; totalPages: number; totalElements: number },
    { page: number; size?: number }
  >({
    query: ({ page }) => {
      return {
        url: `/posts`,
        method: 'GET',
        params: {
          page,
          size: MAX_AMOUNT_OF_ELEMENTS_PER_PAGE,
        },
      };
    },
  });
