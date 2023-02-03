import { api } from '../../api';
import fetchPosts from './fetchPosts';
import savePost from './savePost';
import fetchComments from './fetchComments';
import saveFavorite from './saveFavorite';
import saveEmoji from './saveEmoji';
import removeFavorite from './removeFavorite';
import removeEmoji from './removeEmoji';

export const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchPosts: fetchPosts(build),
    savePost: savePost(build),
    saveFavorite: saveFavorite(build),
    saveEmoji: saveEmoji(build),
    removeFavorite: removeFavorite(build),
    removeEmoji: removeEmoji(build),
    fetchComments: fetchComments(build),
  }),
  overrideExisting: true,
});

export type Emoji = {
  data: any;
  emoji: string;
  name: string;
  index: number;
  selected: boolean;
};

export type Post = {
  id: string;
  body: string;
  timestamp: string;
  qty_comments: number;
  user_id: string;
  user_info: {
    display_name: string;
    image_path: string;
    verified: boolean;
  };
  image?: string;
  parent_id?: string;
  users_favorites: string[];
  emojis: Emoji[];
};
