import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/Hooks';

interface Props {
  customStyles?: any;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 0.1,
    borderWidth: 0.16,
    borderBottomWidth: 0.2,
    position: 'relative',
  },
});

const Divider = ({ customStyles }: Props) => {
  const { Colors } = useTheme();

  return (
    <Text
      style={{
        ...styles.divider,
        ...customStyles,
        borderBottomColor: Colors.darkGray,
      }}
    />
  );
};

export default Divider;
