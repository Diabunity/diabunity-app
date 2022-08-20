import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Button } from 'react-native-ui-lib';

interface FormButtonProps {
  label: string;
  disabledCondition?: boolean;
  noMarginBottom?: boolean;
  onPress: () => void;
  backgroundColor?: string;
  labelStyle?: TextStyle;
}

const FormButton = ({
  label,
  disabledCondition,
  onPress,
  noMarginBottom = false,
  backgroundColor = '#000', // TODO: This default color must be extracted from the theme or an upper scope
  ...rest
}: FormButtonProps) => (
  <Button
    label={label.toUpperCase()}
    disabled={disabledCondition ?? false}
    onPress={onPress}
    backgroundColor={backgroundColor}
    color="#fff"
    borderRadius={4}
    labelStyle={{ ...styles.label, ...rest.labelStyle }}
    marginT-20
    marginB-20={!noMarginBottom}
  />
);

const styles = StyleSheet.create({
  label: {
    letterSpacing: 1.25,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FormButton;
