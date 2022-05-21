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

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  useEffect(() => {
    //TODO: Check if device supports NFC
    const nfcInstance = new NFCReader()
    setNFCInstance(nfcInstance)
  }, [])

  const onTag = async () => {
    if (!nfcInstance) return
    const tag = await nfcInstance.readTag()
    const memory = nfcInstance.getMemoryData(tag)
    if (memory) {
      Clipboard.setString(memory?.toString());
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
        style={[Common.button.rounded, Gutters.regularBMargin]}
        onPress={onTag}
      >
        <Text style={Fonts.textRegular}>Medir Glucosa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ExampleContainer;
