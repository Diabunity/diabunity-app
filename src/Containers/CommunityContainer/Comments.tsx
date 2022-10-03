import React from 'react';
import { Avatar } from 'react-native-ui-lib';
import { Text, View } from 'react-native';
import { Picker } from 'react-native-slack-emoji/src';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/Hooks/useTheme';
import { EmojiLisType } from '.';

import { styles } from './styles';

type CommentProps = {
  emojiList: EmojiLisType[];
};

const Comments = ({ emojiList }: CommentProps) => {
  const { Layout, Colors, Fonts } = useTheme();

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
              updateEmoji={() => {}}
              onSelect={() => {}}
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
              <Icon name="message-square" size={30} />
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

export default Comments;
