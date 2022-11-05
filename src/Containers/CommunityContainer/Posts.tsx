import React, { useEffect, useState } from 'react';
import { Avatar, Incubator, SkeletonView } from 'react-native-ui-lib';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import DropShadow from 'react-native-drop-shadow';
import { Picker } from 'react-native-slack-emoji/src';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/Hooks/useTheme';
import AuthService from '@/Services/modules/auth';
import { Post, postApi } from '@/Services/modules/posts';
import { setNotification } from '@/Store/Notification';
import { store } from '@/Store';
import { getNameInitials, getRelativeTime } from '@/Utils';
import { DIABUNITY_USER } from '@/Constants';
import Divider from '@/Components/Divider';

import { styles } from './styles';

type PostsProps = {
  handleSelected: (post: Post) => void;
  shouldRefetch: boolean;
  favoriteSection: boolean;
};

const Posts = ({
  handleSelected,
  shouldRefetch,
  favoriteSection,
}: PostsProps) => {
  const { Layout, Colors, Fonts } = useTheme();
  const user = AuthService.getCurrentUser();
  const [postPage, setPostPage] = useState<number>(0);
  const {
    data = null,
    isFetching,
    refetch: refetchFn,
  } = postApi.useFetchPostsQuery({
    page: postPage,
    favoriteSection,
  });
  const [saveFavorite] = postApi.useSaveFavoriteMutation();
  const [removeFavorite] = postApi.useRemoveFavoriteMutation();
  const [saveEmoji] = postApi.useSaveEmojiMutation();
  const [removeEmoji] = postApi.useRemoveEmojiMutation();
  const [isFetchingState, setIsFetchingState] = useState<boolean>(isFetching);
  const [postData, setPostData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endReached, setEndReached] = useState<boolean>(shouldRefetch);
  const [favsLoading, setFavsLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [emojisLoading, setEmojisLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const posts = data?.posts;
  const totalPages = data?.paging.total_pages || 0;
  useEffect(() => {
    refetchFn();
  }, []);
  useEffect(() => {
    if (posts && !isFetching) {
      if (loading) {
        setPostData((prevState) => [
          ...prevState,
          ...posts.filter(
            (post) => !prevState.map((post) => post.id).includes(post.id)
          ),
        ]);
      } else {
        setPostData(posts);
      }

      setIsFetchingState(false);
      setLoading(false);
      setEndReached(false);
    } else {
      if (!isFetching) {
        setIsFetchingState(false);
        setLoading(false);
      }
    }
  }, [postPage, posts, isFetching]);

  useEffect(() => {
    if (!endReached) return;
    const nextPage = postPage + 1;
    if (nextPage <= totalPages - 1) {
      setPostPage(nextPage);
      setLoading(true);
    }
  }, [endReached]);

  useEffect(() => {
    setEndReached(shouldRefetch);
  }, [shouldRefetch]);

  const handleFavorite = async (postId: string, isRemove: boolean) => {
    try {
      setFavsLoading((prevState) => ({ ...prevState, [postId]: true }));
      if (!isRemove) {
        await saveFavorite(postId);
      } else {
        await removeFavorite(postId);
      }
      refetchFn();
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: `Hubo un error al ${
            isRemove ? 'borrar' : 'agregar'
          } el favorito. Intente nuevamente`,
        })
      );
    } finally {
      setFavsLoading((prevState) => ({ ...prevState, [postId]: false }));
    }
  };

  const onSelect = async (
    emoji: any,
    emojiName: string,
    data: any,
    post: Post
  ) => {
    const { emojis, id } = post;
    const selectedEmoji = emojis.find((item) => item.name === emojiName);
    if (!selectedEmoji?.selected) {
      const savedEmoji = { emoji, name: emojiName, data };
      try {
        setEmojisLoading((prevState) => ({ ...prevState, [post.id]: true }));
        await saveEmoji({ id, emoji: savedEmoji });
        refetchFn();
      } finally {
        setEmojisLoading((prevState) => ({ ...prevState, [post.id]: false }));
      }
    }
  };

  const updateEmoji = async (emoji: any, name: string, post: Post) => {
    const { emojis, id } = post;
    const selectedEmoji = emojis.find((item) => item.name === name);
    try {
      setEmojisLoading((prevState) => ({ ...prevState, [post.id]: true }));
      if (selectedEmoji?.selected) {
        await removeEmoji({ id, name });
      } else {
        const savedEmoji = { emoji, name, data: selectedEmoji?.data };
        await saveEmoji({ id, emoji: savedEmoji });
      }
      refetchFn();
    } finally {
      setEmojisLoading((prevState) => ({ ...prevState, [post.id]: false }));
    }
  };
  return (
    <>
      {!isFetchingState && !postData?.length ? (
        <View
          style={[
            Layout.fill,
            Layout.colCenter,
            Layout.alignItemsCenter,
            { marginTop: 20 },
          ]}
        >
          <Icon name="inbox" size={35} color={Colors.darkGray} />
          <Card.Title
            style={[Layout.colCenter]}
            title="No hay informacion para mostrar"
            subtitle="No se han encontrado publicaciones"
            subtitleStyle={styles.card}
          />
        </View>
      ) : (
        <SkeletonView
          template={SkeletonView.templates.LIST_ITEM}
          showContent={!!postData && !isFetchingState && !loading}
          style={{
            ...Layout.colCenter,
            ...styles.skeleton,
          }}
          renderContent={() =>
            postData?.map((post) => {
              return (
                <View key={post.id}>
                  <View style={{ padding: 20 }}>
                    <View
                      style={[Layout.rowCenter, Layout.justifyContentBetween]}
                    >
                      <View style={[Layout.rowCenter]}>
                        <Avatar
                          size={40}
                          containerStyle={{ marginVertical: 10 }}
                          animate
                          labelColor={Colors.white}
                          backgroundColor={Colors.red}
                          label={getNameInitials(
                            post.username || DIABUNITY_USER
                          )}
                        />
                        <Text
                          style={[
                            Fonts.textRegular,
                            styles.userName,
                            { color: Colors.red },
                          ]}
                        >
                          {post.username || DIABUNITY_USER}
                        </Text>
                      </View>
                      <Text>{getRelativeTime(post.timestamp)}</Text>
                    </View>
                    <View>
                      <Text>{post.body}</Text>
                      {post.image && (
                        <DropShadow
                          style={{
                            ...styles.dropShadow,
                            shadowColor: Colors.dark,
                          }}
                        >
                          <Image
                            source={{
                              uri: `data:image/jpeg;base64,${post.image}`,
                            }}
                            style={styles.imageFeed}
                          />
                        </DropShadow>
                      )}
                    </View>
                    <View
                      style={{
                        ...styles.emojiContainer,
                        backgroundColor: Colors.white,
                      }}
                    >
                      {emojisLoading[post.id] ? (
                        <ActivityIndicator size="small" color={Colors.black} />
                      ) : (
                        <Picker
                          emojiList={post.emojis}
                          updateEmoji={(emoji: any, name: string) =>
                            updateEmoji(emoji, name, post)
                          }
                          onSelect={(
                            emoji: any,
                            emojiName: string,
                            data: any
                          ) => onSelect(emoji, emojiName, data, post)}
                        />
                      )}
                    </View>
                    <Divider
                      customStyles={{ borderBottomColor: Colors.darkGray }}
                    />
                    <View
                      style={[
                        Layout.rowHCenter,
                        Layout.alignItemsCenter,
                        styles.commentBox,
                      ]}
                    >
                      <View style={[Layout.rowCenter, styles.actionableItem]}>
                        <Icon
                          onPress={() => handleSelected(post)}
                          name="message-square"
                          size={30}
                        />
                        <Text style={{ marginLeft: 5 }}>
                          {post.qty_comments}
                        </Text>
                      </View>
                      <View style={[Layout.rowCenter, styles.actionableItem]}>
                        <Icon
                          name="star"
                          size={30}
                          onPress={() =>
                            handleFavorite(
                              post.id,
                              post?.users_favorites.includes(user?.uid || '')
                            )
                          }
                          color={
                            post?.users_favorites.includes(user?.uid || '')
                              ? Colors.red
                              : Colors.black
                          }
                        />
                        {favsLoading[post.id] ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.black}
                          />
                        ) : (
                          <Text style={{ marginLeft: 5 }}>
                            {post?.users_favorites.length}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <Divider
                    customStyles={{
                      ...styles.divider,
                      backgroundColor: Colors.darkGray,
                    }}
                  />
                </View>
              );
            })
          }
          times={5}
        />
      )}
      <View style={styles.done}>
        {loading && <ActivityIndicator size="small" color={Colors.black} />}
        {!loading && !isFetchingState && postPage + 1 === totalPages && (
          <Text>No hay mas publicaciones.</Text>
        )}
      </View>
    </>
  );
};

export default Posts;
