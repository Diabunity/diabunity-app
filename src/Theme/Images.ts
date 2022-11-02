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
    logoType: require('@/Assets/Images/logotipo.png'),
    nfcAndroid: require('@/Assets/Images/nfc-512.png'),
    onboarding1: require('@/Assets/Images/onboarding-1.png'),
    onboarding2: require('@/Assets/Images/onboarding-2.png'),
    onboarding3: require('@/Assets/Images/onboarding-3.png'),
    onboarding4: require('@/Assets/Images/onboarding-4.png'),
    onboarding5: require('@/Assets/Images/onboarding-5.png'),
    onboarding6: require('@/Assets/Images/onboarding-6.png'),
    addDrop: require('@/Assets/Images/add-drop.png'),
  };
}
