import { ThemeColors } from '@/Theme/theme.type';
import { StyleSheet, ViewStyle } from 'react-native';

const generateRow = (colors: ThemeColors) =>
  ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: colors.gray,
  } as ViewStyle);

const dropShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 5,
};

export const generateTableStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: generateRow(colors),
    dropShadow,
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: colors.gray,
      backgroundColor: '#fff',
      marginTop: 15,
    },
    dateAndSourceContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '30%',
      alignItems: 'flex-start',
    },
    dateAndSource: {
      fontWeight: '400',
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.87)',
    },
    value: {
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      width: '35%',
    },
  });

export const generateFooterStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: generateRow(colors),
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

export const headerStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginTop: 15,
    borderRadius: 3,
    borderWidth: 0.5,
    dropShadow,
  },
  font: {
    fontSize: 16,
  },
});
