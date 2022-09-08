import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { Button } from 'react-native-ui-lib';

interface FormButtonProps {
  label: string;
  disabledCondition?: boolean;
  noMarginBottom?: boolean;
  onPress: () => void;
  backgroundColor?: string;
  labelStyle?: TextStyle;
  activeOpacity?: number;
}

const FormButton = ({
  label,
  disabledCondition,
  onPress,
  noMarginBottom = false,
  backgroundColor = '#000', // TODO: This default color must be extracted from the theme or an upper scope
  ...rest
}: FormButtonProps) => (
  <DropShadow style={styles.dropShadow}>
    <Button
      label={label.toUpperCase()}
      disabled={disabledCondition ?? false}
      onPress={onPress}
      activeOpacity={rest.activeOpacity ?? 0.5}
      backgroundColor={backgroundColor}
      color="#fff"
      borderRadius={4}
      labelStyle={{ ...styles.label, ...rest.labelStyle }}
      marginT-20
      marginB-20={!noMarginBottom}
    />
  </DropShadow>
);

const styles = StyleSheet.create({
  label: {
    letterSpacing: 1.25,
    fontSize: 14,
    fontWeight: '500',
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FormButton;
