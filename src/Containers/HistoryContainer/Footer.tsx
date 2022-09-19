import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { styles } from './styles';

export enum PAGE_DIRECTION {
  NEXT = 'NEXT',
  PREV = 'PREV',
}

const footerStyles = StyleSheet.create({
  chevron: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  index: {
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  enabled: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.2)',
  },
  pageInfoContainer: {
    justifyContent: 'flex-end',
  },
});

export default ({
  pages,
  currentPage,
  totalElements,
  onPageChangeSelected,
}: {
  pages: number;
  currentPage: number;
  totalElements: number;
  onPageChangeSelected: Function;
}) => {
  const isLeftChevronEnabled = currentPage > 0;
  const isRightChevronEnabled = currentPage < pages - 1;
  const from = currentPage * 10 + 1;
  const to = Math.min((currentPage + 1) * 10, totalElements);
  return (
    <View style={{ ...styles.row, ...footerStyles.pageInfoContainer }}>
      <Text style={footerStyles.index}>
        {from}-{to} de {totalElements}
      </Text>
      <Text
        style={{
          marginLeft: 38,
          ...footerStyles.index,
          ...footerStyles.chevron,
          ...(isLeftChevronEnabled
            ? { ...footerStyles.enabled }
            : { ...footerStyles.disabled }),
        }}
        onPress={
          isLeftChevronEnabled
            ? () => onPageChangeSelected(PAGE_DIRECTION.PREV)
            : undefined
        }
      >
        &#10094;
      </Text>
      <Text
        style={{
          marginLeft: 42,
          ...footerStyles.index,
          ...footerStyles.chevron,
          ...(isRightChevronEnabled
            ? { ...footerStyles.enabled }
            : { ...footerStyles.disabled }),
        }}
        onPress={
          isRightChevronEnabled
            ? () => onPageChangeSelected(PAGE_DIRECTION.NEXT)
            : undefined
        }
      >
        &#10095;
      </Text>
    </View>
  );
};
