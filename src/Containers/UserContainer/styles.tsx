import { StyleSheet } from 'react-native';
import { Colors } from '@/Theme/Variables';

const title = {
  marginBottom: 20,
  fontSize: 16,
  lineHeight: 24,
  width: '90%',
  textAlign: 'center',
  color: Colors.darkGray,
};

export const styles = StyleSheet.create({
  title,
  icon: {
    color: Colors.dark,
  },
  text: {
    color: Colors.black,
    marginVertical: 5,
    fontSize: 14,
  },
  scrollViewContainer: {
    width: 400,
    margin: 20,
  },
  divider: {
    width: '90%',
    height: 0.1,
    borderWidth: 0.16,
    borderBottomWidth: 0.2,
    position: 'relative',
    top: 0,
    borderBottomColor: Colors.shadow,
    marginHorizontal: 22,
  },
  back: {
    marginTop: 5,
    marginLeft: 0,
  },
  input: {
    width: 277,
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.inputBackgroundShadow,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  picker: {
    height: 72,
  },
  margin: {
    marginBottom: 20,
  },
  button: {
    textAlign: 'center',
  },
  mask: {
    position: 'relative',
    top: 5,
    fontWeight: '300',
  },
  donation: {
    margin: 20,
    position: 'absolute',
    width: '90%',
    bottom: 50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.purple,
    height: 52,
  },
  donationImage: {
    width: 30,
    height: 30,
  },
  donationText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  slider: {
    width: 277,
    height: 52,
    color: Colors.red,
  },
  sliderView: {
    marginTop: 26,
    flex: 1,
    flexDirection: 'row',
  },
  sliderText: {
    position: 'absolute',
    top: 50,
  },
  done: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 20,
  },
  checkmark: {
    height: 25,
    width: 25,
    position: 'relative',
    top: 2,
    left: 5,
  },
});

export const favoriteStyles = StyleSheet.create({
  title: { ...title, width: '100%' },
});

export const rankingStyles = StyleSheet.create({
  skeleton: {
    marginHorizontal: 20,
  },
  title: { ...title, width: '100%' },
  currentUserContainer: {
    marginHorizontal: 21,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',

    // Shadow stuff
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  firstUserContainer: {
    // Shadow stuff
    borderWidth: 0.5,
    borderColor: Colors.gray,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    paddingTop: 10,
  },
  currentUserStatsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currentUserLabel: {
    fontSize: 14,
    color: Colors.blackish,
  },
  currentUserValue: {
    textAlign: 'center',
    color: Colors.red,
    fontWeight: '900',
  },
  currentUserAvatar: {
    marginTop: 6,
    marginBottom: 14,
    marginHorizontal: 47,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.gray,
  },
  rowNumber: {
    width: 30,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  rowName: {
    fontSize: 16,
  },
  rowPercentage: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  listAvatar: {
    marginVertical: 15,
    marginLeft: 16,
    marginRight: 13,
  },
});
