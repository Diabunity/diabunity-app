import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';
import { changeTheme, ThemeState } from '@/Store/Theme';

import { NFCReader } from '@/Services/modules/nfc';
import Clipboard from '@react-native-community/clipboard';

const ExampleContainer = () => {
  const { t } = useTranslation();
  const { Common, Fonts, Gutters, Layout } = useTheme();
  const dispatch = useDispatch();

  const [nfcInstance, setNFCInstance] = useState<NFCReader>()
  const [isScanning, setIsScanning] = useState(false)

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  useEffect(() => {
    const init = async () => {
      const nfcInstance = new NFCReader()
      const supported = await nfcInstance.init()
      if (!supported) {
        Alert.alert("NFC is not supported");
      } else {
        setNFCInstance(nfcInstance)
      }
    }
    init()
  }, [])

  const onTag = async () => {
    if (!nfcInstance || isScanning) return
    setIsScanning(true)
    const glucoseData = await nfcInstance.getGlucoseData()
    console.log('Glucositaaa', glucoseData)
    setIsScanning(false)
    if (glucoseData) {
      console.log('data:', glucoseData);
      Clipboard.setString(glucoseData.toString());
      Alert.alert(
        "Glucose data copied to Clipboard!"
      );
    }
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Layout.fill,
        Layout.colCenter,
        Gutters.smallHPadding,
      ]}
    >
      <TouchableOpacity
        style={[Common.button.rounded, Gutters.regularBMargin, { height: 50 }]}
        onPress={onTag}
        disabled={isScanning}
        activeOpacity={!isScanning ? 0.5 : 1}
      >
        <Text style={Fonts.textRegular}>Medir Glucosa</Text>
      </TouchableOpacity>
    </ScrollView >
  );
};

export default ExampleContainer;
