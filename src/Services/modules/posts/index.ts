import { api } from '../../api';
import fetchPosts from './fetchPosts';
import savePost from './savePost';
import fetchComments from './fetchComments';

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchPosts: fetchPosts(build),
    savePost: savePost(build),
    fetchComments: fetchComments(build),
  }),
  overrideExisting: true,
});

export type Post = {
  id: string;
  body: string;
  timestamp: string;
  qtyComments: number;
  userId: string;
  username: string;
  image?: string;
  parent_id?: string;
};
