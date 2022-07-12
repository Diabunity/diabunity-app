import { StyleSheet } from 'react-native';

const grayText = 'rgba(0, 0, 0, 0.5)';

export default StyleSheet.create({
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
    color: '#C1272D',
    fontWeight: '700',
  },
});
