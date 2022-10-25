import { api } from '../../api';
import fetchPosts from './fetchPosts';
import savePost from './savePost';
import fetchComments from './fetchComments';
import saveFavorite from './saveFavorite';
import removeFavorite from './removeFavorite';

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchPosts: fetchPosts(build),
    savePost: savePost(build),
    saveFavorite: saveFavorite(build),
    removeFavorite: removeFavorite(build),
    fetchComments: fetchComments(build),
  }),
  overrideExisting: true,
});

export type Post = {
  id: string;
  body: string;
  timestamp: string;
  qty_comments: number;
  user_id: string;
  username: string;
  image?: string;
  parent_id?: string;
  users_favorites: string[];
};
