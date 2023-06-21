import { StyleSheet } from 'react-native';
import { Colors } from '@/Theme/Variables';

export const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.black,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '400',
  },
  textBox: {
    padding: 20,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    fontSize: 16,
    marginTop: 10,
  },
});
