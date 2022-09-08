import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Colors } from '@/Theme/Variables';
import { Text } from 'react-native-ui-lib';

const DEFAULT_VALUE = [0, 200];

const styles = StyleSheet.create({
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
    top: 35,
  },
  thumb: {
    backgroundColor: Colors.red,
    borderColor: '#FEFEFE',
    borderRadius: 10,
    borderWidth: 5,
    height: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    width: 20,
  },
  track: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
    height: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
});

const SliderContainer = (props: {
  children?: JSX.Element;
  sliderValue?: number[];
  trackMarks?: any;
  onValueChange?: (value: number[]) => void;
}) => {
  const { sliderValue, trackMarks, onValueChange } = props;
  const [value, setValue] = React.useState(
    sliderValue ? sliderValue : DEFAULT_VALUE
  );

  const handleChange = (value: number[]) => {
    setValue(value);
    onValueChange?.(value);
  };

  const renderChildren = () => {
    return React.Children.map(props.children, (child) => {
      if (!!child && child.type === Slider) {
        return React.cloneElement(child, {
          onValueChange: handleChange,
          animateTransitions: true,
          thumbStyle: { ...styles.thumb },
          trackStyle: { ...styles.track },
          trackMarks,
          minimumTrackTintColor: Colors.red,
          thumbTintColor: Colors.red,
          value,
        });
      }
      return child;
    });
  };

  const [min, max] = value;
  return (
    <View style={styles.slider}>
      <Text style={styles.sliderText} bodySmall>
        {min} mg/dL
      </Text>
      {renderChildren()}
      <Text style={{ ...styles.sliderText, right: 0 }} bodySmall>
        {max} mg/dL
      </Text>
    </View>
  );
};

export default SliderContainer;
