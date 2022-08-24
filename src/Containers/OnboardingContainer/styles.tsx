import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  mask: {
    position: 'relative',
    top: 5,
    fontWeight: '300',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    marginHorizontal: 3,
  },
  done: {
    fontSize: 16,
    marginRight: 20,
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 36,
    paddingBottom: 0,
  },
  pageImage: {
    paddingBottom: 24,
  },
  pageContainer: {
    justifyContent: 'flex-start',
    marginTop: '50%',
  },
  pageSubtitle: {
    padding: 24,
    fontSize: 13,
    color: 'black',
  },
  pageSubtitleContainer: {
    marginTop: 26,
    overflow: 'hidden',
  },
  slider: {
    width: 277,
    height: 52,
    color: '#C1272D',
  },
});
