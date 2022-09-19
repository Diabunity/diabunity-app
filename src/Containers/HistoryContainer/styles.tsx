import { StyleSheet } from 'react-native';

export const COLORS = {
  gray: 'rgba(0, 0, 0, 0.12)',
  darkGray: '#666',
};

export const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
    textAlign: 'center',
    color: COLORS.darkGray,
  },
  skeleton: {
    padding: 10,
    marginTop: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: '#fff',
    marginTop: 15,
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: COLORS.gray,
  },
  dateAndSourceContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    alignItems: 'flex-start',
  },
  dateAndSource: {
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  index: {
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  value: {
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '35%',
  },
  pageInfoContainer: {
    justifyContent: 'flex-end',
  },
  chevron: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  enabled: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.2)',
  },
});
