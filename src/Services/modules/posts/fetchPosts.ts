import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import AuthService from '@/Services/modules/auth';
import { Post } from '.';

const MAX_AMOUNT_OF_ELEMENTS_PER_PAGE = 10;

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    { posts: Post[]; paging: { total_pages: number; total_elements: number } },
    { page: number; favoriteSection: boolean; size?: number }
  >({
    query: ({ page, favoriteSection }) => {
      return {
        url: favoriteSection
          ? `/users/${AuthService.getCurrentUser()?.uid}/posts/favs`
          : `/posts`,
        method: 'GET',
        params: {
          page,
          size: MAX_AMOUNT_OF_ELEMENTS_PER_PAGE,
        },
      };
    },
  });
