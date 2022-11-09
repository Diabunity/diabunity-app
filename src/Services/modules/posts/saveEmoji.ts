import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { Emoji } from '.';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<
    Emoji,
    { id: string; emoji: Omit<Emoji, 'index' | 'selected'> }
  >({
    query: ({ id, emoji }) => {
      return {
        url: `/posts/${id}/reaction`,
        method: 'POST',
        body: {
          ...emoji,
        },
      };
    },
  });
