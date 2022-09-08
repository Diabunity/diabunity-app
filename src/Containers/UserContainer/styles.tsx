import { StyleSheet } from 'react-native';
import { Colors } from '@/Theme/Variables';

export const COLORS = {
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
};

export const styles = StyleSheet.create({
  icon: {
    color: '#323232',
  },
  text: {
    color: '#000000',
    fontSize: 14,
  },
  divider: {
    width: '90%',
    height: 0.1,
    borderWidth: 0.16,
    borderBottomWidth: 0.2,
    position: 'relative',
    top: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.42)',
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
  title: {
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
    width: '90%',
    textAlign: 'center',
    color: COLORS.darkGray,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
});
