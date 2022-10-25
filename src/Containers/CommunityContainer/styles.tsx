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

  bottomView: {
    width: '98%',
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 52,
    borderTopWidth: 0.15,
  },
  headerLogo: {
    marginRight: 0,
  },

  input: {
    width: 320,
    height: 45,
    position: 'relative',
    top: 7,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },

  postBox: {
    height: 200,
  },
  button: {
    width: 80,
    height: 20,
    textAlign: 'center',
  },
  postActions: {
    position: 'relative',
    bottom: 10,
    right: 15,
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
    shadowColor: '#000',
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
    right: 35,
    color: '#666',
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
