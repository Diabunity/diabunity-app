import React from 'react';
import { Text, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { NavigatorParams } from '@/Navigators/Application';
import { useTheme } from '@/Hooks';
import FormButton from '@/Components/FormButton';

import { styles } from './styles';

type Props = NativeStackScreenProps<NavigatorParams>;

const NoNetworkContainer = ({ navigation: { navigate } }: Props) => {
  const { Layout, Colors } = useTheme();
  const netInfo = useNetInfo();
  const navigationState = useNavigationState((state) => state);

  const handleRetry = () => {
    if (netInfo.isConnected === false) return;
    const { index, routes } = navigationState;
    const lastPage = routes[index - 1];
    if (lastPage) {
      navigate(lastPage.name as any);
    } else {
      navigate('NoNetwork');
    }
  };

  return (
    <View style={[Layout.fill]}>
      <View style={[Layout.fill, Layout.colCenter]}>
        <Icon name="wifi-off" size={84} color={Colors.red} />
        <View style={[Layout.colCenter]}>
          <Text style={styles.title}>Sin conexi&oacute;n</Text>
          <Text style={styles.subtitle}>Por favor, intenta nuevamente.</Text>
          <FormButton
            label="Reintentar"
            onPress={handleRetry}
            noMarginBottom
            backgroundColor={Colors.red}
          />
        </View>
      </View>
    </View>
  );
};

export default NoNetworkContainer;
