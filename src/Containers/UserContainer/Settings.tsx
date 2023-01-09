import React from 'react';
import { WebView } from 'react-native-webview';
import { Platform, View } from 'react-native';
import { useTheme } from '@/Hooks';

const Settings = () => {
  const { Layout } = useTheme();
  const webViewSource =
    Platform.OS === 'ios'
      ? require('@/Assets/Templates/mp_integration.html')
      : {
          uri: 'file:///android_asset/mp_integration.html',
          baseUrl: 'file:///android_asset/',
        };
  const onMessageReceived = (event: any) => {
    console.log(JSON.parse(event.nativeEvent.data));
  };
  return (
    <View style={[Layout.fill]}>
      <WebView
        scalesPageToFit
        bounces={false}
        startInLoadingState
        onMessage={onMessageReceived}
        originWhitelist={['*']}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        source={webViewSource}
        style={{ marginTop: 20, flex: 1 }}
      />
    </View>
  );
};

export default Settings;
