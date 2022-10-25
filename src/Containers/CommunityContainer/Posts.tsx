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
import { EmojiLisType } from '.';

import { styles } from './styles';

type PostsProps = {
  handleSelected: (post: Post) => void;
  emojiList: EmojiLisType[];
  setEmojiList: (emojiList: EmojiLisType[]) => void;
  shouldRefetch: boolean;
};

const Posts = ({
  handleSelected,
  emojiList,
  setEmojiList,
  shouldRefetch,
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
  });
  const [saveFavorite] = postApi.useSaveFavoriteMutation();
  const [removeFavorite] = postApi.useRemoveFavoriteMutation();
  const [fetchCompleted, setFetchCompleted] = useState<boolean>(isFetching);
  const [postData, setPostData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endReached, setEndReached] = useState<boolean>(shouldRefetch);
  const [favsLoading, setFavsLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const posts = data?.posts;
  console.log(data);
  const totalPages = data?.paging.totalPages || 0;

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

      setFetchCompleted(false);
      setLoading(false);
      setEndReached(false);
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
            isRemove ? 'borrar' : 'crear'
          } el favorito. Intente nuevamente`,
        })
      );
    } finally {
      setFavsLoading((prevState) => ({ ...prevState, [postId]: false }));
    }
  };

  const onSelect = (emoji: any, emojiName: string, data: any) => {
    const objIndex = emojiList.findIndex((e) => e.name === emojiName);
    const filteredList = emojiList.filter((_, index) => index !== objIndex);

    if (objIndex === -1) {
      setEmojiList([...emojiList, { emoji, name: emojiName, data, index: 1 }]);
    } else {
      const filteredValue = emojiList[objIndex].added
        ? emojiList[objIndex].index + 1
        : emojiList[objIndex].index === 1
        ? undefined
        : emojiList[objIndex].index - 1;
      if (!filteredValue) {
        setEmojiList(filteredList);
      } else {
        setEmojiList([
          ...emojiList.filter((_, index) => index !== objIndex),
          {
            ...emojiList[objIndex],
            index: filteredValue,
            added: !emojiList[objIndex].added,
          },
        ]);
      }
    }
  };

  const updateEmoji = (_: any, name: string) => {
    const objIndex = emojiList.findIndex((e) => e.name === name);
    const filteredList = emojiList.filter((_, index) => index !== objIndex);
    const filteredValue = emojiList[objIndex].added
      ? emojiList[objIndex].index + 1
      : emojiList[objIndex].index === 1
      ? undefined
      : emojiList[objIndex].index - 1;
    if (!filteredValue) {
      setEmojiList(filteredList);
    } else {
      setEmojiList([
        ...filteredList,
        {
          ...emojiList[objIndex],
          index: filteredValue,
          added: !emojiList[objIndex].added,
        },
      ]);
    }
  };
  return (
    <>
      {!fetchCompleted && !postData?.length ? (
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
          showContent={!!postData && !fetchCompleted && !loading}
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
                          label={getNameInitials(post.username)}
                        />
                        <Text
                          style={[
                            Fonts.textRegular,
                            styles.userName,
                            { color: Colors.red },
                          ]}
                        >
                          {post.username}
                        </Text>
                      </View>
                      <Text>{getRelativeTime(post.timestamp)}</Text>
                    </View>
                    <View>
                      <Text>{post.body}</Text>
                      {post.image && (
                        <DropShadow style={styles.dropShadow}>
                          <Image
                            source={{
                              uri: `data:image/jpeg;base64,${post.image}`,
                            }}
                            style={styles.imageFeed}
                          />
                        </DropShadow>
                      )}
                    </View>
                    <View style={styles.emojiContainer}>
                      <Picker
                        emojiList={emojiList}
                        updateEmoji={updateEmoji}
                        onSelect={onSelect}
                      />
                    </View>
                    <Text
                      style={{
                        ...styles.divider,
                        borderBottomColor: Colors.darkGray,
                      }}
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
                  <Text
                    style={{
                      ...styles.divider,
                      backgroundColor: Colors.darkGray,
                      opacity: 0.5,
                      height: 4,
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
        {!loading && !fetchCompleted && postPage + 1 === totalPages && (
          <Text>No hay mas publicaciones.</Text>
        )}
      </View>
    </>
  );
};

export default Posts;
