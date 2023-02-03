import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Image, Text } from 'react-native-ui-lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import DropShadow from 'react-native-drop-shadow';
import { NavigatorParams } from '@/Navigators/Application';
import { useTheme } from '@/Hooks';
import { BackButton, Divider, FormButton } from '@/Components';
import { styles } from './styles';
import { premiumFeatures } from './constants';

type Props = NativeStackScreenProps<NavigatorParams>;

const WithoutPremiumContainer = ({
  navigation: { goBack, canGoBack },
}: Props) => {
  const { Layout, Images, Colors } = useTheme();

  return (
    <ImageBackground
      source={Images.proBackground}
      resizeMode="cover"
      style={[Layout.fill]}
    >
      <BackButton goBack={goBack} canGoBack={canGoBack} color={Colors.white} />
      <View style={{ paddingHorizontal: 20 }}>
        <Image
          style={{ width: '100%', height: 100 }}
          resizeMode={'center'}
          source={Images.diabunityPro}
        />
        <Divider
          customStyles={{
            borderBottomColor: Colors.white,
            backgroundColor: Colors.white,
            borderBottomWidth: 1,
          }}
        />
        <View style={[Layout.center]}>
          <Text style={{ ...styles.featureTitle, marginTop: 20 }}>
            ACCESO COMPLETO
          </Text>
          <Text style={{ ...styles.featureTitle, marginBottom: 20 }}>
            A TODAS LAS FUNCIONALIDADES
          </Text>
        </View>
      </View>
      <DropShadow style={styles.dropShadow}>
        <View style={[Layout.center, styles.container]}>
          {premiumFeatures.map((feature) => (
            <View key={feature.id} style={[styles.rowItem]}>
              <View style={{ marginRight: 5 }}>
                <Icon name="check-circle" size={24} color={Colors.red} />
              </View>
              <View style={[Layout.fill]}>
                <Text style={styles.title}>{feature.title.toUpperCase()}</Text>
                <Text style={styles.description}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </DropShadow>
      <View style={[Layout.fill, { marginHorizontal: 20 }]}>
        <FormButton
          label="Muy pronto"
          onPress={() => undefined}
          noMarginBottom
          disabledCondition={true}
          backgroundColor={Colors.red}
        />
      </View>
    </ImageBackground>
  );
};

export default WithoutPremiumContainer;
