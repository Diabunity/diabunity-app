import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { Avatar, ListItem, Text } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User, userApi } from '@/Services/modules/users';
import { useTheme } from '@/Hooks';
import AuthService from '@/Services/modules/auth';
import { getNameInitials } from '@/Utils';
import { styles } from './styles';
import ExternalLink from '@/Components/ExternalLink';
import BackButton from '@/Components/BackButton';
import PersonalData from './PersonalData';

enum PageSection {
  SETTINGS = 'SETTINGS',
  PERSONAL_DATA = 'PERSONAL_DATA',
}

const UserContainer = () => {
  const user = AuthService.getCurrentUser();
  const isFocused = useIsFocused();
  const [page, setPage] = useState<PageSection | undefined>();
  const { Layout, Fonts, Colors } = useTheme();
  const { data = null, refetch } = userApi.useFetchUserQuery(user?.uid, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFocused) {
      setPage(undefined);
    }
  }, [isFocused]);

  const handleLogOut = async () => {
    await AuthService.signOut();
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
      case PageSection.SETTINGS:
        return (
          <>
            <Text>Settings</Text>
          </>
        );
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
      <ScrollView
        contentContainerStyle={[Layout.colCenter, { paddingBottom: 100 }]}
      >
        {renderSection()}
      </ScrollView>
    </>
  );
};

export default UserContainer;
