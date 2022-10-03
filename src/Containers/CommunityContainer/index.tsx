import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, Text } from 'react-native';
import { Avatar } from 'react-native-ui-lib';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '@/Hooks';
import AuthService from '@/Services/modules/auth';
import { User, userApi } from '@/Services/modules/users';
import BackButton from '@/Components/BackButton';
import Posts from './Posts';
import Comments from './Comments';

import { styles } from './styles';

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

const CommunityContainer = () => {
  const user = AuthService.getCurrentUser();
  const [page, setPage] = useState<PageSection | undefined>(PageSection.POSTS);
  const [emojiList, setEmojiList] = useState<EmojiLisType[]>([]);
  const { Layout, Images, Colors } = useTheme();

  const getLeftComponent = () => {
    switch (page) {
      case PageSection.POSTS:
        return (
          <>
            <Avatar
              size={40}
              containerStyle={{ marginVertical: 20, marginHorizontal: 20 }}
              animate
              isOnline
              imageProps={{ animationDuration: 1000 }}
              labelColor={Colors.white}
              backgroundColor={Colors.red}
              source={{ uri: user?.photoURL }}
            />
          </>
        );
      case PageSection.COMMENT:
        return (
          <BackButton
            customBack={() => setPage(PageSection.POSTS)}
            customStyles={styles.back}
          />
        );
      case PageSection.NEW_POST:
        return (
          <Icon onPress={() => setPage(PageSection.POSTS)} name="x" size={30} />
        );
    }
  };
  return (
    <View style={{ ...Layout.fill }}>
      {page === PageSection.POSTS && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: Colors.red }]}
          onPress={() => setPage(PageSection.NEW_POST)}
        />
      )}
      <View
        style={[
          Layout.rowCenter,
          Layout.justifyContentBetween,
          { marginRight: 10 },
        ]}
      >
        {getLeftComponent()}
        <Image source={Images.logoType} />
        <Icon name="bell" size={30} />
      </View>
      <CommunitySection
        emojiList={emojiList}
        setEmojiList={setEmojiList}
        setPage={setPage}
        page={page}
      />
    </View>
  );
};

const CommunitySection = ({
  page,
  setPage,
  emojiList,
  setEmojiList,
  data,
  refetchFn,
}: {
  data?: User | null;
  emojiList: EmojiLisType[];
  setEmojiList: (emojiList: EmojiLisType[]) => void;
  refetchFn?: () => void;
  page: PageSection | undefined;
  setPage: (page: PageSection) => void;
}) => {
  const renderSection = () => {
    switch (page) {
      case PageSection.COMMENT:
        return <Comments emojiList={emojiList} />;
      case PageSection.NEW_POST:
        return (
          <>
            <Text>New Post</Text>
          </>
        );
      default:
        return (
          <Posts
            emojiList={emojiList}
            setEmojiList={setEmojiList}
            setPage={setPage}
          />
        );
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={[{ paddingBottom: 100 }]}>
        {renderSection()}
      </ScrollView>
    </>
  );
};

export default CommunityContainer;
