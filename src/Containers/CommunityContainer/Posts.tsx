import React, { useState } from 'react';
import { Avatar } from 'react-native-ui-lib';
import { Text, View } from 'react-native';
import { Picker } from 'react-native-slack-emoji/src';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/Hooks/useTheme';
import { EmojiLisType, PageSection } from '.';

import { styles } from './styles';

type PostsProps = {
  setPage: (page: PageSection) => void;
  emojiList: EmojiLisType[];
  setEmojiList: (emojiList: EmojiLisType[]) => void;
};

const Posts = ({ setPage, emojiList, setEmojiList }: PostsProps) => {
  const { Layout, Colors, Fonts } = useTheme();

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
      <View>
        <View style={{ padding: 20 }}>
          <View style={[Layout.rowCenter, Layout.justifyContentBetween]}>
            <View style={[Layout.rowCenter]}>
              <Avatar
                size={40}
                containerStyle={{ marginVertical: 10 }}
                animate
                isOnline
                labelColor={Colors.white}
                backgroundColor={Colors.red}
                label="MD"
              />
              <Text
                style={[
                  Fonts.textRegular,
                  styles.userName,
                  { color: Colors.red },
                ]}
              >
                Mati Dastugue
              </Text>
            </View>
            <Text>23h</Text>
          </View>
          <View style={[Layout.rowCenter]}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
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
                onPress={() => setPage(PageSection.COMMENT)}
                name="message-square"
                size={30}
              />
              <Text style={{ marginLeft: 5 }}>30</Text>
            </View>
            <View style={[Layout.rowCenter, styles.actionableItem]}>
              <Icon name="star" size={30} />
              <Text style={{ marginLeft: 5 }}>22</Text>
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
    </>
  );
};

export default Posts;
