import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/Hooks';

import { NFCReader } from '@/Services/modules/nfc';
import Clipboard from '@react-native-community/clipboard';

const ExampleContainer = () => {
  const { Common, Fonts, Gutters, Layout } = useTheme();
  const [nfcInstance, setNFCInstance] = useState<NFCReader>();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const init = async () => {
      const NFCObj = new NFCReader();
      const supported = await NFCObj.init();
      if (!supported) {
        Alert.alert('NFC is not supported');
      } else {
        setNFCInstance(NFCObj);
      }
    };
    init();
  }, []);

  const onTag = async () => {
    if (!nfcInstance || isScanning) {
      return;
    }
    setIsScanning(true);
    const glucoseData = await nfcInstance.getGlucoseData();
    setIsScanning(false);
    if (glucoseData) {
      Clipboard.setString(glucoseData.toString());
      Alert.alert('Glucose data copied to Clipboard!');
    }
  };

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
    </ScrollView>
  );
};

export default ExampleContainer;
