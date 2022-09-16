import { StyleSheet } from 'react-native';

export const COLORS = {
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
};

export const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
    textAlign: 'center',
    color: COLORS.darkGray,
  },
  skeleton: {
    padding: 10,
    marginTop: 10,
  },
});
