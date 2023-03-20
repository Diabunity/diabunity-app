import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

export const styles = StyleSheet.create({
  proImage: {
    height: 70,
    width: 350,
  },
  header: {
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 10,
    marginHorizontal: 20,
    borderRadius: 3,
  },
  rowItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backgroundImage: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  featureTitle: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },

  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  scrollViewContainer: {
    height: 660,
  },
});
