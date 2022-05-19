import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Brand } from '@/Components';
import { useTheme } from '@/Hooks';
import { useLazyFetchOneQuery } from '@/Services/modules/users';
import { changeTheme, ThemeState } from '@/Store/Theme';

const ExampleContainer = () => {
  const { t } = useTranslation();
  const { Common, Fonts, Gutters, Layout } = useTheme();
  const dispatch = useDispatch();

  const [glucose, setGlucose] = useState<TagEvent | null>(null);

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  const readNdef = async () => {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
      setGlucose(tag)
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
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
        onPress={readNdef}
      >
        <Text style={Fonts.textRegular}>Medir Glucosa</Text>
      </TouchableOpacity>
      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>Glucosa : {JSON.stringify(glucose)}</Text>
    </ScrollView>
  );
};

export default ExampleContainer;
