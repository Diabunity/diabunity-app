import React, { useEffect, useState } from 'react';
import {
  View,
  Share,
  Platform,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Avatar,
  Incubator,
  ListItem,
  Text,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User, userApi } from '@/Services/modules/users';
import { NavigatorParams } from '@/Navigators/Application';
import { setNotification } from '@/Store/Notification';
import { useTheme } from '@/Hooks';
import { store } from '@/Store';
import AuthService from '@/Services/modules/auth';
import { getNameInitials } from '@/Utils';
import ExternalLink from '@/Components/ExternalLink';
import BackButton from '@/Components/BackButton';
import PersonalData from './PersonalData';
import Settings from './Settings';
import Ranking from './Ranking';
import Favorites from './Favorites';

import { version as appVersion } from '../../../package.json';

import { styles } from './styles';

export enum PageSection {
  SETTINGS = 'SETTINGS',
  PERSONAL_DATA = 'PERSONAL_DATA',
  RANKING = 'RANKING',
  FAVORITES = 'FAVORITES',
}
type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<{ params?: { section?: PageSection } }, 'params'>;
};

const UserContainer = ({ route, navigation }: Props) => {
  const { setParams, navigate } = navigation;
  const user = AuthService.getCurrentUser();
  const { data: userInfo = null, refetch } = userApi.useFetchUserQuery(
    user?.uid,
    {
      refetchOnMountOrArgChange: true,
      skip: !user,
    }
  );
  const { section } = route?.params || { section: undefined };
  const isFocused = useIsFocused();
  const [page, setPage] = useState<PageSection | undefined>(section);
  const { Layout, Fonts, Colors, Images } = useTheme();

  useEffect(() => {
    if (!isFocused) {
      setPage(undefined);
      setParams({ section: undefined });
    }
  }, [isFocused]);

  useEffect(() => {
    setPage(section);
  }, [section]);

  const handleLogOut = async () => {
    try {
      await AuthService.signOut();
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al cerrar sesión.',
        })
      );
    }
  };

  const onDonation = async (url: string) => {
    await Linking.openURL(url);
  };

  const onShare = () => {
    let text =
      'Te invito a formar parte de la comunidad de Diabunity!\nDescarga la app del siguiente link:';
    if (Platform.OS === 'android') {
      text = text.concat(
        'https://play.google.com/store/apps/details?id=com.diabunity'
      );
    } else {
      text = text.concat('<APP store link>');
    } //TODO: change to appstore link
    Share.share(
      {
        title: 'Descarga la app de Diabunity!',
        message: text,
        url: 'app://diabunity',
      },
      {
        // Android only:
        dialogTitle: 'Compartir la App de Diabunity',
        // iOS only:
        excludedActivityTypes: [],
      }
    );
  };

  const onReportIssue = async () => {
    const emailData = {
      to: 'hola@diabunity.com',
      subject: `Reporte de problema - Versión ${appVersion}`,
      body: '(explícanos el problema que encontraste)',
    };
    try {
      await Linking.openURL(
        `mailto:${emailData.to}?subject=${emailData.subject}&body=${emailData.body}`
      );
    } catch (e) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message:
            'Hubo un error al abrir la aplicación de correo. Intente nuevamente',
        })
      );
    }
  };

  return (
    <>
      {page ? (
        <ProfileSection
          user={user}
          page={page}
          data={userInfo}
          handleBack={setPage}
          refetchFn={refetch}
        />
      ) : (
        <View style={[Layout.fill]}>
          <View style={[Layout.fill, Layout.alignItemsStart]}>
            <View style={[Layout.rowCenter]}>
              <Avatar
                size={60}
                containerStyle={{ marginVertical: 20, marginHorizontal: 20 }}
                animate
                isOnline
                imageProps={{ animationDuration: 1000 }}
                labelColor={Colors.white}
                backgroundColor={Colors.red}
                source={{ uri: user?.photoURL }}
                label={getNameInitials(user?.displayName)}
              />
              {user && (
                <Text style={Fonts.textRegular}>{user.displayName}</Text>
              )}
              {userInfo?.verified && (
                <View>
                  <Image style={styles.checkmark} source={Images.checkmark} />
                </View>
              )}
            </View>
            <View style={styles.divider} />
            <ScrollView
              contentContainerStyle={[
                Layout.colCenter,
                Layout.alignItemsStart,
                styles.scrollViewContainer,
              ]}
            >
              <ListItem
                style={[Layout.rowCenter]}
                onPress={() => setPage(PageSection.PERSONAL_DATA)}
              >
                <Icon name="user" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Datos personales
                </Text>
              </ListItem>
              <ListItem
                style={[Layout.rowCenter]}
                onPress={() => setPage(PageSection.FAVORITES)}
              >
                <Icon name="star" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Favoritos
                </Text>
              </ListItem>
              <ListItem
                style={[Layout.rowCenter]}
                onPress={() => setPage(PageSection.RANKING)}
              >
                <Icon name="award" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>Ranking</Text>
              </ListItem>
              <ListItem
                onPress={() => navigate('WithoutPremium')}
                style={[Layout.rowCenter]}
              >
                <Icon name="lock" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Diabunity<Text style={{ fontWeight: '800' }}>PRO</Text>
                </Text>
              </ListItem>
              <ListItem style={[Layout.rowCenter]} onPress={onShare}>
                <Icon name="share-2" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Invitar miembro
                </Text>
              </ListItem>
              <ListItem style={[Layout.rowCenter]}>
                <Icon name="info" size={24} color={styles.icon.color} />
                <ExternalLink
                  style={{ ...styles.text, marginLeft: 12 }}
                  url="https://diabunity.com"
                >
                  <Text>Sobre Diabunity</Text>
                </ExternalLink>
              </ListItem>
              <ListItem style={[Layout.rowCenter]} onPress={onReportIssue}>
                <Icon name="x-octagon" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Reportar un problema
                </Text>
              </ListItem>
              <ListItem style={[Layout.rowCenter]} onPress={handleLogOut}>
                <Icon name="log-out" size={24} color={styles.icon.color} />
                <Text style={{ ...styles.text, marginLeft: 12 }}>
                  Cerrar sesión
                </Text>
              </ListItem>
            </ScrollView>
          </View>
          <View style={[Layout.colHCenter, Layout.fill, { maxHeight: 150 }]}>
            <TouchableOpacity
              style={{
                ...styles.donation,
                ...Layout.center,
                ...Layout.rowCenter,
              }}
              onPress={() => onDonation('https://cafecito.app/diabunity')}
            >
              <Image
                style={styles.donationImage}
                source={Images.cafecitoLogo}
              />
              <Text style={styles.donationText}>APOYÁ EL PROYECTO</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const ProfileSection = ({
  page,
  data,
  user,
  handleBack,
  refetchFn,
}: {
  data: User | null;
  user: FirebaseAuthTypes.User | null;
  refetchFn: () => void;
  handleBack: (page: PageSection | undefined) => void;
  page: PageSection;
}) => {
  const renderSection = () => {
    switch (page) {
      case PageSection.FAVORITES:
        return <Favorites />;
      case PageSection.RANKING:
        return <Ranking user={user} />;
      case PageSection.SETTINGS:
        return <Settings />;
      case PageSection.PERSONAL_DATA:
        return <PersonalData data={data} user={user} refetchFn={refetchFn} />;
      default:
        return null;
    }
  };

  return (
    <>
      <BackButton
        customBack={() => handleBack(undefined)}
        customStyles={styles.back}
      />
      {renderSection()}
    </>
  );
};

export default UserContainer;
