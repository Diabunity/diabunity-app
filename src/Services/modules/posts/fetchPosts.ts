import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { PostResponse } from '.';

const MAX_AMOUNT_OF_ELEMENTS_PER_PAGE = 10;

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    PostResponse | { qty_posts: number; user_id: string },
    { page?: number; favoriteSection?: boolean; size?: number; count?: boolean }
  >({
    query: ({ page, favoriteSection, count }) => {
      return {
        url: favoriteSection
          ? `/users/${AuthService.getCurrentUser()?.uid}/posts/favs`
          : `/posts`,
        method: 'GET',
        params: {
          page,
          size: MAX_AMOUNT_OF_ELEMENTS_PER_PAGE,
          count,
        },
      };
    },
  });
