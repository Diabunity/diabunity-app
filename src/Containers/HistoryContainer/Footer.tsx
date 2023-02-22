import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import { generateFooterStyles } from './styles';
import { MAX_AMOUNT_OF_ELEMENTS_PER_PAGE } from '@/Services/modules/users/fetchMeasurement';
import { PAGE_DIRECTION } from '@/Constants';
import { Alert } from 'react-native';

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
  const { Colors } = useTheme();
  const styles = generateFooterStyles(Colors);
  const isLeftChevronEnabled = currentPage > 0;
  const isRightChevronEnabled = currentPage < pages - 1;
  const from = currentPage * MAX_AMOUNT_OF_ELEMENTS_PER_PAGE + 1;
  const to = Math.min(
    (currentPage + 1) * MAX_AMOUNT_OF_ELEMENTS_PER_PAGE,
    totalElements
  );
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
            : () =>
                Alert.alert(
                  'No hay más mediciones',
                  'Intente nuevamente seleccionando otro período de fechas.'
                )
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
            : () =>
                Alert.alert(
                  'No hay más mediciones',
                  'Intente nuevamente seleccionando otro período de fechas'
                )
        }
      >
        &#10095;
      </Text>
    </View>
  );
};
