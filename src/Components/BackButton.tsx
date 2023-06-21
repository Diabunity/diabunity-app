import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  canGoBack?: () => boolean;
  goBack?: () => void;
  customBack?: () => void;
  color?: string;
  customIcon?: string;
  customStyles?: ViewStyle;
};

const BackButton = ({
  canGoBack,
  goBack,
  customBack,
  customStyles,
  customIcon,
  color,
}: Props) => {
  const hasGoBackPage = customBack || canGoBack?.();
  return (
    <>
      {hasGoBackPage && (
        <View style={{ ...styles.container, ...customStyles }}>
          <Icon
            onPress={customBack || goBack}
            name={customIcon || 'chevron-left'}
            size={35}
            color={color ?? styles.icon.color}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 20,
  },
  icon: {
    color: '#323232',
  },
});

export default BackButton;
