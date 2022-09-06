import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Linking } from 'react-native';

type Props = {
  url: string;
  children: React.ReactNode;
  style?: any;
};

const ExternalLink = (props: Props) => {
  const { url, children, style = {} } = props;

  const onPress = () =>
    Linking.canOpenURL(url).then(() => {
      Linking.openURL(url);
    });

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default ExternalLink;
