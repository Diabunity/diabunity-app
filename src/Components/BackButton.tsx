import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  canGoBack: () => boolean;
  goBack: () => void;
};

const BackButton = ({ canGoBack, goBack }: Props) => {
  const hasGoBackPage = canGoBack();
  return (
    <>
      {hasGoBackPage && (
        <View style={styles.container}>
          <Icon
            onPress={goBack}
            name="chevron-left"
            size={35}
            color={styles.icon.color}
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
