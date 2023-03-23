import React, { useEffect, useRef, useState } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { Avatar, Incubator, TextField } from 'react-native-ui-lib';
import { FAB } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme, useUser } from '@/Hooks';
import { Post, postApi } from '@/Services/modules/posts';
import { setNotification } from '@/Store/Notification';
import { store } from '@/Store';
import AuthService from '@/Services/modules/auth';
import { getNameInitials } from '@/Utils';
import { PageSection as ProfileSection } from '@/Containers/UserContainer';
import { NavigatorParams } from '@/Navigators/Application';
import { SubscriptionType, User } from '@/Services/modules/users';
import BackButton from '@/Components/BackButton';
import Posts from './Posts';
import NewPost from './NewPost';
import Comments from './Comments';

import { styles } from './styles';
import { createNativeWrapper } from 'react-native-gesture-handler';

export enum PageSection {
  POSTS = 'POSTS',
  COMMENT = 'COMMENT',
  NEW_POST = 'NEW_POST',
}

export type EmojiLisType = {
  name: string;
  index: number;
  added?: boolean;
  data: any;
  emoji: any;
};

type Navigation = NativeStackScreenProps<NavigatorParams> | { navigation: any };
type Props = Navigation & {
  favoriteSection: boolean;
};

const CommunityContainer = ({
  navigation: { navigate },
  favoriteSection,
}: Props) => {
  const user = AuthService.getCurrentUser();
  const { subscription } = useUser();
  const [page, setPage] = useState<PageSection | undefined>(PageSection.POSTS);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const { data: userPostsInfo, refetch } = postApi.useFetchPostsQuery({
    count: true,
  });
  const { Layout, Images, Colors } = useTheme();

  useEffect(() => {
    refetch();
  }, [page]);

  const handlePostCreation = () => {
    let { qty_posts } = userPostsInfo as { qty_posts: number };
    qty_posts = qty_posts ?? 0;
    const metadata = subscription.metadata as Record<string, number>;
    if (subscription.subscription_type === SubscriptionType.FREE) {
      if (qty_posts >= metadata.maxPostPerDay) {
        navigate('WithoutPremium');
        return;
      }
    }
    setPage(PageSection.NEW_POST);
  };

  const getLeftComponent = () => {
    switch (page) {
      case PageSection.POSTS:
        return (
          <Avatar
            size={40}
            onPress={() => navigate('Profile')}
            containerStyle={{ marginVertical: 20, marginLeft: 20 }}
            animate
            labelColor={Colors.white}
            backgroundColor={Colors.red}
            label={getNameInitials(user?.displayName)}
            source={
              {
                uri: user?.photoURL,
              } as ImageSourcePropType
            }
          />
        );
      case PageSection.COMMENT:
        return (
          <BackButton
            customBack={() => {
              setShouldRefetch(false);
              setPage(PageSection.POSTS);
            }}
            customStyles={styles.back}
          />
        );
      case PageSection.NEW_POST:
        return (
          <Icon
            style={{ marginLeft: 20 }}
            onPress={() => {
              setShouldRefetch(false);
              setPage(PageSection.POSTS);
            }}
            name="x"
            size={30}
          />
        );
    }
  };
  return (
    <View style={{ ...Layout.fill }}>
      {page === PageSection.POSTS && !favoriteSection && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: Colors.red }]}
          onPress={handlePostCreation}
        />
      )}
      {!favoriteSection && (
        <View
          style={[
            Layout.rowCenter,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            styles.headerContainer,
          ]}
        >
          {getLeftComponent()}
          <Image source={Images.logoType} />
          <Icon
            onPress={() =>
              navigate('Profile', { section: ProfileSection.RANKING })
            }
            name="award"
            color={Colors.black}
            size={30}
          />
        </View>
      )}
      <CommunitySection
        favoriteSection={favoriteSection}
        setPage={setPage}
        refetch={shouldRefetch}
        setShouldRefetch={setShouldRefetch}
        page={page}
      />
    </View>
  );
};

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -40;

const CustomRefreshControl = createNativeWrapper(RefreshControl, {
  disallowInterruption: true,
  shouldCancelWhenOutside: false,
});

const CommunitySection = ({
  page,
  setPage,
  favoriteSection,
  refetch,
  setShouldRefetch,
}: {
  data?: User | null;
  favoriteSection: boolean;
  refetch: boolean;
  setShouldRefetch: (refetch: boolean) => void;
  page: PageSection | undefined;
  setPage: (page: PageSection) => void;
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { Colors } = useTheme();
  const [showSendIcon, setShowSendIcon] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [refreshing, setRefreshing] = useState(false);
  const [comment, setComment] = useState<string>();
  const [savePost, { isLoading, isSuccess, isError, error }] =
    postApi.useSavePostMutation();
  const refreshRef = React.useRef(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'El comentario se ha creado exitosamente.',
        })
      );
      setShouldRefetch(false);
      setPage(PageSection.POSTS);
      setSelectedPost(undefined);
    }
    if (isError) {
      crashlytics().recordError(error, 'Error saving post');
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al crear el comentario. Intente nuevamente',
        })
      );
    }
  }, [isSuccess, isError]);

  const handleSelected = (post: Post) => {
    setSelectedPost(post);
    setPage(PageSection.COMMENT);
  };

  const publishComment = async () => {
    const newComent = {
      body: comment,
      parent_id: selectedPost?.id,
    } as Post;
    await savePost(newComent);
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: { height: number };
    contentOffset: { y: number };
    contentSize: { height: number };
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderSection = () => {
    switch (page) {
      case PageSection.COMMENT:
        return <Comments post={selectedPost} />;
      case PageSection.NEW_POST:
        return (
          <NewPost setShouldRefetch={setShouldRefetch} setPage={setPage} />
        );
      default:
        return (
          <Posts
            isUserRefetching={refreshing}
            onRefreshEnd={() => setRefreshing(false)}
            favoriteSection={favoriteSection}
            shouldRefetch={refetch}
            handleSelected={handleSelected}
          />
        );
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
            keyboardVerticalOffset={keyboardVerticalOffset}
          >
            <ScrollView
              ref={scrollViewRef}
              refreshControl={
                page === PageSection.POSTS && (
                  <CustomRefreshControl
                    refreshing={refreshing}
                    ref={refreshRef}
                    onRefresh={onRefresh}
                    progressBackgroundColor={Colors.white}
                    colors={[Colors.red]}
                  />
                )
              }
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  setShouldRefetch(true);
                } else {
                  setShouldRefetch(false);
                }
              }}
              scrollEventThrottle={400}
              contentContainerStyle={[
                { paddingBottom: showSendIcon ? 0 : 140 },
              ]}
            >
              {!refreshing && page === PageSection.POSTS && (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text>Desliza hacia arriba para refrescar</Text>
                </View>
              )}
              {renderSection()}
            </ScrollView>

            {page === PageSection.COMMENT && (
              <View
                style={{ ...styles.bottomView, backgroundColor: Colors.white }}
              >
                <TextField
                  migrate
                  floatOnFocus
                  style={{
                    ...styles.input,
                    backgroundColor: Colors.inputBackgroundShadow,
                    paddingRight: showSendIcon ? 40 : 10,
                  }}
                  placeholder="Escribe algo..."
                  onChangeText={(value: string) => setComment(value)}
                  enableErrors
                  onFocus={() => {
                    setShowSendIcon(true);
                    scrollViewRef?.current?.scrollToEnd({ animated: true });
                  }}
                  onBlur={() => setShowSendIcon(false)}
                />

                {showSendIcon && (
                  <Icon
                    style={{ ...styles.textIcon, color: Colors.darkGray }}
                    name="send"
                    size={20}
                    onPress={publishComment}
                  />
                )}
                {isLoading && (
                  <ActivityIndicator
                    style={styles.commentLoadingIcon}
                    size="small"
                    color={Colors.black}
                  />
                )}
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommunityContainer;
