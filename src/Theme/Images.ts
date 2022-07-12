import { ThemeImages, ThemeVariables } from '@/Theme/theme.type';

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({}: ThemeVariables): ThemeImages {
  return {
    logo: require('@/Assets/Images/logo.png'),
    logoWithName: require('@/Assets/Images/logo-with-name.png'),
    nfcAndroid: require('@/Assets/Images/nfc-512.png'),
  };
}
