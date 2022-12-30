import React from 'react';
import { ImageProps, StyleSheet, TextStyle, Dimensions } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { scaleText } from 'react-native-text';
import { Button } from 'react-native-ui-lib';

interface FormButtonProps {
  label: string;
  disabledCondition?: boolean;
  noMarginBottom?: boolean;
  onPress: () => void;
  backgroundColor?: string;
  labelStyle?: TextStyle;
  icon?: ImageProps['source'] | Function;
  activeOpacity?: number;
  style?: any;
}

const FormButton = ({
  label,
  disabledCondition,
  onPress,
  icon,
  noMarginBottom = false,
  backgroundColor = '#000', // TODO: This default color must be extracted from the theme or an upper scope
  ...rest
}: FormButtonProps) => (
  <DropShadow style={styles.dropShadow}>
    <Button
      style={rest.style}
      label={label.toUpperCase()}
      disabled={disabledCondition ?? false}
      onPress={onPress}
      iconSource={icon}
      activeOpacity={rest.activeOpacity ?? 0.5}
      backgroundColor={backgroundColor}
      color="#fff"
      borderRadius={4}
      labelStyle={{ ...styles.label, ...rest.labelStyle }}
      marginT-20
      padding-28
      marginB-20={!noMarginBottom}
    />
  </DropShadow>
);

const fontStyles = scaleText({
  deviceBaseWidth: Dimensions.get('window').width,
  fontSize: 14,
});

const styles = StyleSheet.create({
  label: {
    letterSpacing: 1.25,
    ...fontStyles,
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
