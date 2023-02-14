import { Colors } from '@/Theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  back: {
    marginTop: 5,
    marginLeft: 15,
  },
  userName: {
    marginLeft: 10,
    fontWeight: '700',
  },
  divider: {
    opacity: 0.5,
    height: 4,
  },
  emojiContainer: {
    flex: 1,
    padding: 10,
    paddingLeft: 0,
  },
  text: {
    color: Colors.black,
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
  headerContainer: {
    marginRight: 10,
    marginTop: 10,
  },
  bottomView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 52,
    borderTopWidth: 0.15,
  },
  headerLogo: {
    marginRight: 0,
  },
  postContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  postBody: {
    marginBottom: 20,
    paddingLeft: 40,
  },
  input: {
    width: 350,
    height: 45,
    position: 'relative',
    top: 7,
    paddingHorizontal: 12,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  postBox: {
    height: 150,
  },
  button: {
    width: 80,
  },
  checkmark: {
    height: 25,
    width: 25,
    position: 'relative',
    top: 5,
    left: 5,
  },
  postActions: {
    position: 'relative',
    bottom: 10,
  },
  imageContainer: {
    height: 100,
    width: 100,
    marginBottom: 10,
  },
  imageFeed: {
    marginTop: 20,
    height: 350,
  },
  dropShadow: {
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textIcon: {
    position: 'absolute',
    right: '7%',
  },
  commentLoadingIcon: {
    position: 'absolute',
    right: '15%',
  },
  done: {
    fontSize: 20,
    marginTop: 10,
    display: 'flex',
    alignSelf: 'center',
  },
  skeleton: {
    padding: 10,
    marginTop: 10,
  },
  card: {
    textAlign: 'center',
    fontSize: 14,
  },
});
