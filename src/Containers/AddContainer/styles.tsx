import { StyleSheet } from 'react-native';

export const colors = {
  red: '#C1272D', // TODO: This should be moved into an upper scope as it is used in the app.
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
};

export const styles = StyleSheet.create({
  button: {
    width: 168,
    textAlign: 'center',
  },
  text: {
    marginBottom: 5,
  },
  notSupported: {
    marginTop: 5,
  },
  back: {
    marginTop: 0,
    marginLeft: 0,
  },
  header: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
    textAlign: 'center',
    color: colors.darkGray,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  input: {
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
  scrollView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    fontSize: 16,
    marginTop: 10,
  },
});
