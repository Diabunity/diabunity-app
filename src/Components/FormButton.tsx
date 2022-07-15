import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

interface FormButtonProps {
  label: string;
  disabledCondition?: boolean;
  onPress: () => void;
  backgroundColor?: string;
}

const FormButton = ({
  label,
  disabledCondition,
  onPress,
  backgroundColor = '#000', // TODO: This default color must be extracted from the theme or an upper scope
}: FormButtonProps) => (
  <Button
    label={label.toUpperCase()}
    disabled={disabledCondition ?? false}
    onPress={onPress}
    backgroundColor={backgroundColor}
    color="#fff"
    borderRadius={4}
    labelStyle={styles.label}
    marginT-20
    marginB-20
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
