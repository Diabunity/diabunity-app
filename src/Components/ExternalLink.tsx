import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Linking } from 'react-native';
import { Incubator } from 'react-native-ui-lib';
import { setNotification } from '@/Store/Notification';
import { store } from '@/Store';

type Props = {
  url: string;
  children: React.ReactNode;
  style?: any;
};

const ExternalLink = (props: Props) => {
  const { url, children, style = {} } = props;

  const onPress = () =>
    Linking.canOpenURL(url)
      .then(() => {
        Linking.openURL(url);
      })
      .catch(() => {
        store.dispatch(
          setNotification({
            preset: Incubator.ToastPresets.FAILURE,
            message: 'Hubo un error al abrir el link.',
          })
        );
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
