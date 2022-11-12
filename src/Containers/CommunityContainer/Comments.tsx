import React, { useState } from 'react';
import { Avatar, SkeletonView, Incubator } from 'react-native-ui-lib';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Picker } from 'react-native-slack-emoji/src';
import DropShadow from 'react-native-drop-shadow';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import AuthService from '@/Services/modules/auth';
import { setNotification } from '@/Store/Notification';
import { store } from '@/Store';
import useTheme from '@/Hooks/useTheme';
import { getNameInitials, getRelativeTime } from '@/Utils';
import { DIABUNITY_USER, BRAND_NAME } from '@/Constants';
import { Post, postApi } from '@/Services/modules/posts';
import Divider from '@/Components/Divider';

import { styles } from './styles';

type CommentProps = {
  post?: Post;
};

const Comments = ({ post }: CommentProps) => {
  const { Layout, Colors, Fonts, Images } = useTheme();
  const user = AuthService.getCurrentUser();
  const { data = null, isFetching } = postApi.useFetchCommentsQuery(post?.id, {
    refetchOnMountOrArgChange: true,
  });
  const [saveEmoji] = postApi.useSaveEmojiMutation();
  const [removeEmoji] = postApi.useRemoveEmojiMutation();
  const [emojisLoading, setEmojisLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const onSelect = async (
    emoji: any,
    emojiName: string,
    data: any,
    post?: Post
  ) => {
    if (!post) return;
    const { emojis, id } = post;
    const selectedEmoji = emojis.find((item) => item.name === emojiName);
    if (!selectedEmoji?.selected) {
      const savedEmoji = { emoji, name: emojiName, data };
      try {
        setEmojisLoading((prevState) => ({ ...prevState, [post.id]: true }));
        await saveEmoji({ id, emoji: savedEmoji });
        //refetchFn();
      } catch {
        store.dispatch(
          setNotification({
            preset: Incubator.ToastPresets.FAILURE,
            message: 'Hubo un error al agregar la reacción. Intente nuevamente',
          })
        );
      } finally {
        setEmojisLoading((prevState) => ({ ...prevState, [post.id]: false }));
      }
    }
  };

  const updateEmoji = async (emoji: any, name: string, post?: Post) => {
    if (!post) return;
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
      //refetchFn();
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
      setEmojisLoading((prevState) => ({ ...prevState, [post.id]: false }));
    }
  };

  const posts = data?.posts;
  return (
    <>
      <View>
        <View style={{ padding: 20 }}>
          <View style={[Layout.rowCenter, Layout.justifyContentBetween]}>
            <View style={[Layout.rowCenter]}>
              <Avatar
                size={40}
                containerStyle={{ marginVertical: 10 }}
                animate
                labelColor={Colors.white}
                backgroundColor={Colors.red}
                label={getNameInitials(post?.username || DIABUNITY_USER)}
              />
              <Text
                style={[
                  Fonts.textRegular,
                  styles.userName,
                  { color: Colors.red },
                ]}
              >
                {post?.username || DIABUNITY_USER}
                {post?.username === BRAND_NAME && (
                  <Image style={styles.checkmark} source={Images.checkmark} />
                )}
              </Text>
            </View>
            <Text>{getRelativeTime(post?.timestamp ?? '')}</Text>
          </View>
          <View>
            <Text>{post?.body}</Text>
            {post?.image && (
              <DropShadow
                style={{ ...styles.dropShadow, shadowColor: Colors.dark }}
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
            {emojisLoading[post?.id || 0] ? (
              <ActivityIndicator size="small" color={Colors.black} />
            ) : (
              <Picker
                hideSelector
                emojiList={post?.emojis}
                updateEmoji={(emoji: any, name: string) =>
                  updateEmoji(emoji, name, post)
                }
                onSelect={(emoji: any, emojiName: string, data: any) =>
                  onSelect(emoji, emojiName, data, post)
                }
              />
            )}
          </View>
          <Divider customStyles={{ borderBottomColor: Colors.darkGray }} />
          <View
            style={[
              Layout.rowHCenter,
              Layout.alignItemsCenter,
              styles.commentBox,
            ]}
          >
            <View style={[Layout.rowCenter, styles.actionableItem]}>
              <Icon name="message-square" size={30} />
              <Text style={{ marginLeft: 5 }}>{post?.qty_comments}</Text>
            </View>
            <View style={[Layout.rowCenter, styles.actionableItem]}>
              <Icon
                name="star"
                size={30}
                color={
                  post?.users_favorites.includes(user?.uid || '')
                    ? Colors.red
                    : Colors.black
                }
              />
              <Text style={{ marginLeft: 5 }}>
                {post?.users_favorites.length}
              </Text>
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
      <View>
        {!isFetching && !posts?.length ? (
          <View style={[Layout.fill, Layout.colCenter]}>
            <Card.Title
              style={[Layout.colCenter]}
              title="No hay informacion para mostrar"
              subtitle="No se han encontrado comentarios"
              subtitleStyle={styles.card}
            />
          </View>
        ) : (
          <SkeletonView
            template={SkeletonView.templates.LIST_ITEM}
            showContent={!!posts && !isFetching}
            style={{
              ...Layout.colCenter,
              ...styles.skeleton,
            }}
            renderContent={() =>
              posts?.map((post) => {
                return (
                  <View key={post.id} style={styles.postContainer}>
                    <View
                      style={[Layout.rowCenter, Layout.justifyContentBetween]}
                    >
                      <View style={[Layout.rowCenter]}>
                        <Avatar
                          size={30}
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
                            Fonts.textSmall,
                            styles.userName,
                            { color: Colors.red },
                          ]}
                        >
                          {post.username || DIABUNITY_USER}
                          {post.username === BRAND_NAME && (
                            <Image
                              style={styles.checkmark}
                              source={Images.checkmark}
                            />
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.postBody}>
                      <Text>{post.body}</Text>
                    </View>
                    <Divider
                      customStyles={{ borderBottomColor: Colors.darkGray }}
                    />
                  </View>
                );
              })
            }
            times={5}
          />
        )}
      </View>
    </>
  );
};

export default Comments;
