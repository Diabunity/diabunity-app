import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { footerStyles as styles } from './styles';

export enum PAGE_DIRECTION {
  NEXT = 'NEXT',
  PREV = 'PREV',
}

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
    <View style={{ ...styles.row, ...styles.pageInfoContainer }}>
      <Text style={styles.index}>
        {from}-{to} de {totalElements}
      </Text>
      <Text
        style={{
          marginLeft: 38,
          ...styles.index,
          ...styles.chevron,
          ...(isLeftChevronEnabled
            ? { ...styles.enabled }
            : { ...styles.disabled }),
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
          ...styles.index,
          ...styles.chevron,
          ...(isRightChevronEnabled
            ? { ...styles.enabled }
            : { ...styles.disabled }),
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
