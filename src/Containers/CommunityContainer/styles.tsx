import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  back: {
    marginTop: 5,
    marginLeft: 0,
  },
  userName: {
    marginLeft: 10,
    fontWeight: '700',
  },
  divider: {
    width: '100%',
    height: 0.1,
    borderWidth: 0.16,
    borderBottomWidth: 0.2,
    position: 'relative',
  },
  emojiContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  commentBox: {
    marginTop: 15,
  },
  actionableItem: {
    marginRight: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    zIndex: 100,
    bottom: 60,
  },
});
