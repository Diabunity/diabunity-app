import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Incubator, ListItem, Text } from 'react-native-ui-lib';
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
import { styles } from './styles';

export enum PageSection {
  SETTINGS = 'SETTINGS',
  PERSONAL_DATA = 'PERSONAL_DATA',
  RANKING = 'RANKING',
}
type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<{ params?: { section?: PageSection } }, 'params'>;
};

const UserContainer = ({ route, navigation: { setParams } }: Props) => {
  const user = AuthService.getCurrentUser();
  const { section } = route?.params || { section: undefined };
  const isFocused = useIsFocused();
  const [page, setPage] = useState<PageSection | undefined>(section);
  const { Layout, Fonts, Colors } = useTheme();
  const { data = null, refetch } = userApi.useFetchUserQuery(user?.uid, {
    refetchOnMountOrArgChange: true,
  });

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

  return (
    <>
      {page ? (
        <ProfileSection
          user={user}
          page={page}
          data={data}
          handleBack={setPage}
          refetchFn={refetch}
        />
      ) : (
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
            {user && <Text style={Fonts.textRegular}>{user.displayName}</Text>}
          </View>
          <View style={styles.divider} />
          <View
            style={[Layout.colCenter, Layout.alignItemsStart, { margin: 20 }]}
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
              onPress={() => setPage(PageSection.RANKING)}
            >
              <Icon name="award" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>Ranking</Text>
            </ListItem>
            <ListItem
              onPress={() => setPage(PageSection.SETTINGS)}
              style={[Layout.rowCenter]}
            >
              <Icon name="settings" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>
                Configuración
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
            <ListItem style={[Layout.rowCenter]} onPress={handleLogOut}>
              <Icon name="log-out" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>
                Cerrar sesión
              </Text>
            </ListItem>
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
  const { Layout } = useTheme();
  const renderSection = () => {
    switch (page) {
      case PageSection.RANKING:
        return <Ranking />;
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
