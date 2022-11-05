import React from 'react';
import { Avatar, SkeletonView } from 'react-native-ui-lib';
import { Image, Text, View } from 'react-native';
import { Picker } from 'react-native-slack-emoji/src';
import DropShadow from 'react-native-drop-shadow';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import AuthService from '@/Services/modules/auth';
import useTheme from '@/Hooks/useTheme';
import { getNameInitials, getRelativeTime } from '@/Utils';
import { DIABUNITY_USER } from '@/Constants';
import { Post, postApi } from '@/Services/modules/posts';
import Divider from '@/Components/Divider';
import { EmojiLisType } from '.';

import { styles } from './styles';

type CommentProps = {
  post?: Post;
};

const Comments = ({ post }: CommentProps) => {
  const { Layout, Colors, Fonts } = useTheme();
  const user = AuthService.getCurrentUser();
  const { data = null, isFetching } = postApi.useFetchCommentsQuery(post?.id, {
    refetchOnMountOrArgChange: true,
  });

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
            <Picker
              emojiList={post?.emojis}
              updateEmoji={() => {}}
              onSelect={() => {}}
            />
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
                          label={getNameInitials(post.username)}
                        />
                        <Text
                          style={[
                            Fonts.textSmall,
                            styles.userName,
                            { color: Colors.red },
                          ]}
                        >
                          {post.username}
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
