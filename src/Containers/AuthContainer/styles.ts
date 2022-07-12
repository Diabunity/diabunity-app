import { StyleSheet } from 'react-native';

const grayText = 'rgba(0, 0, 0, 0.5)';

export const colors = {
  black: '#000', // TODO: This should be moved into an upper scope as it is used in the app.
  red: '#C1272D',
};

export const styles =  StyleSheet.create({
  textField: {
    width: 277,
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.42)',
  },
  text: {
    color: grayText,
  },
  textBottom: {
    color: grayText,
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
  },
  divider: {
    width: 137,
    height: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: grayText,
    marginHorizontal: 22,
  },
  highlight: {
    color: colors.red,
    fontWeight: '700',
  },
});
