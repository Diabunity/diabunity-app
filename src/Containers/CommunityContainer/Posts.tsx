import React, { useEffect, useState } from 'react';
import { Avatar, Incubator, SkeletonView } from 'react-native-ui-lib';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import DropShadow from 'react-native-drop-shadow';
import FastImage from 'react-native-fast-image';
import { Picker } from 'react-native-slack-emoji/src';
import Icon from 'react-native-vector-icons/Feather';
import { Config } from '@/Config';
import useTheme from '@/Hooks/useTheme';
import AuthService from '@/Services/modules/auth';
import { Post, postApi } from '@/Services/modules/posts';
import { setNotification } from '@/Store/Notification';
import { store } from '@/Store';
import { getNameInitials, getRelativeTime } from '@/Utils';
import { DIABUNITY_USER, BRAND_NAME, emojiI18N } from '@/Constants';
import Divider from '@/Components/Divider';

import { styles } from './styles';

type PostsProps = {
  handleSelected: (post: Post) => void;
  shouldRefetch: boolean;
  favoriteSection: boolean;
};

const parseEmojis = (posts?: Post[]) => {
  if (!posts) return {};
  return posts.reduce(
    (prev, post) => ({ ...prev, [post.id]: post.emojis }),
    {}
  );
};

const parseFavs = (posts?: Post[]) => {
  if (!posts) return {};
  return posts.reduce(
    (prev, post) => ({ ...prev, [post.id]: post.users_favorites }),
    {}
  );
};

const Posts = ({
  handleSelected,
  shouldRefetch,
  favoriteSection,
}: PostsProps) => {
  const { Layout, Colors, Fonts, Images } = useTheme();
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
  const posts = data?.posts;
  const [localEmojis, setLocalEmojis] = useState<{ [key: string]: any }>({});
  const [localFavs, setLocalFavs] = useState<{ [key: string]: any }>({});
  const isEmojiClicked = React.useRef(false);
  const isFavClicked = React.useRef(false);

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

      setLocalEmojis((prevState) => ({ ...prevState, ...parseEmojis(posts) }));
      setLocalFavs((prevState) => ({ ...prevState, ...parseFavs(posts) }));
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
    if (isFavClicked.current) return;
    try {
      isFavClicked.current = true;
      const currentFavs = localFavs[postId];
      const newFavs = isRemove
        ? currentFavs.filter((userId: string) => userId !== user?.uid)
        : [...currentFavs, user?.uid];
      setLocalFavs((prevState) => ({
        ...prevState,
        [postId]: newFavs,
      }));
      if (!isRemove) {
        await saveFavorite(postId);
      } else {
        await removeFavorite(postId);
      }
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
      isFavClicked.current = false;
    }
  };

  const onSelect = async (
    emoji: any,
    emojiName: string,
    data: any,
    post: Post
  ) => {
    const { id } = post;
    const currentEmojis = localEmojis[post.id];
    const selectedEmoji = currentEmojis.find(
      (item: { name: string }) => item.name === emojiName
    );
    if (!selectedEmoji?.selected) {
      const savedEmoji = { emoji, name: emojiName, data };
      try {
        const newEmojis = [
          ...currentEmojis,
          {
            ...savedEmoji,
            index: 1,
            selected: true,
          },
        ];
        setLocalEmojis((prevState) => ({
          ...prevState,
          [post.id]: newEmojis,
        }));
        await saveEmoji({ id, emoji: savedEmoji });
      } catch {
        store.dispatch(
          setNotification({
            preset: Incubator.ToastPresets.FAILURE,
            message: 'Hubo un error al agregar la reacción. Intente nuevamente',
          })
        );
      }
    }
  };

  const updateEmoji = async (emoji: any, name: string, post: Post) => {
    if (isEmojiClicked.current) return;
    const { id } = post;
    const currentEmojis = localEmojis[id];
    const selectedEmoji = currentEmojis.find(
      (item: { name: string }) => item.name === name
    );
    if (!selectedEmoji) return;
    try {
      isEmojiClicked.current = true;
      const INDEX_VALUE = selectedEmoji?.selected ? -1 : 1;
      const newEmojis = currentEmojis
        .map((emoji: { name: string; index: number; selected: boolean }) => {
          const index =
            emoji.name === selectedEmoji?.name
              ? emoji.index + INDEX_VALUE
              : emoji.index;
          if (index === 0) return null;
          return {
            ...emoji,
            index,
            selected:
              emoji.name === selectedEmoji?.name
                ? !emoji.selected
                : emoji.selected,
          };
        })
        .filter(Boolean);
      setLocalEmojis((prevState) => ({ ...prevState, [post.id]: newEmojis }));
      if (selectedEmoji?.selected) {
        await removeEmoji({ id, name });
      } else {
        const savedEmoji = { emoji, name, data: selectedEmoji?.data };
        await saveEmoji({ id, emoji: savedEmoji });
      }
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: `Hubo un error al ${
            selectedEmoji?.selected ? 'borrar' : 'agregar'
          } la reacción. Intente nuevamente`,
        })
      );
    } finally {
      isEmojiClicked.current = false;
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
                          source={{ uri: post.user_info?.image_path }}
                          label={getNameInitials(
                            post.user_info.display_name || DIABUNITY_USER
                          )}
                        />
                        <Text
                          style={[
                            Fonts.textRegular,
                            styles.userName,
                            { color: Colors.red },
                          ]}
                        >
                          {post.user_info.display_name || DIABUNITY_USER}
                          {post.user_info.verified && (
                            <View>
                              <Image
                                style={styles.checkmark}
                                source={Images.checkmark}
                              />
                            </View>
                          )}
                        </Text>
                      </View>
                      <Text>{getRelativeTime(post.timestamp)}</Text>
                    </View>
                    <View>
                      <Text style={{ ...styles.text }}>{post.body}</Text>
                      {post.image && (
                        <DropShadow
                          style={{
                            ...styles.dropShadow,
                            shadowColor: Colors.dark,
                          }}
                        >
                          <FastImage
                            style={styles.imageFeed}
                            source={{
                              uri: `${Config.S3_URL}${post.image}`,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
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
                      <Picker
                        i18n={emojiI18N}
                        emojiList={localEmojis[post.id] || []}
                        updateEmoji={(emoji: any, name: string) =>
                          updateEmoji(emoji, name, post)
                        }
                        onSelect={(emoji: any, emojiName: string, data: any) =>
                          onSelect(emoji, emojiName, data, post)
                        }
                      />
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
                          color={Colors.black}
                        />
                        <Text style={{ marginLeft: 5, ...styles.text }}>
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
                              localFavs[post.id]?.includes(user?.uid || '')
                            )
                          }
                          color={
                            localFavs[post.id]?.includes(user?.uid || '')
                              ? Colors.red
                              : Colors.black
                          }
                        />
                        <Text style={{ marginLeft: 5, ...styles.text }}>
                          {localFavs[post.id]?.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Divider
                      customStyles={{
                        ...styles.divider,
                        backgroundColor: Colors.darkGray,
                      }}
                    />
                  </View>
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
