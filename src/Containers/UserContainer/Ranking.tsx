import React from 'react';
import { Text, View, Avatar, SkeletonView } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useTheme } from '@/Hooks';
import { getNameInitials } from '@/Utils';
import { DIABUNITY_USER } from '@/Constants';
import { userApi } from '@/Services/modules/users';

import { rankingStyles } from './styles';
import { Card } from 'react-native-paper';

const Ranking = ({ user }: { user: FirebaseAuthTypes.User | null }) => {
  const { Colors, Layout } = useTheme();
  const { data, isFetching } = userApi.useFetchRankingQuery();
  const userPosition: number = data?.user_info?.position ?? -1;
  const userData =
    userPosition >= 0
      ? {
          ...data?.ranking[userPosition],
          position: userPosition + 1,
        }
      : {
          username: user?.displayName || DIABUNITY_USER,
          picture: user?.photoURL,
          position: null,
          percentage: null,
        };

  return (
    <>
      <Text style={rankingStyles.title}>Ranking mensual</Text>
      {isFetching ? (
        <SkeletonView
          template={SkeletonView.templates.LIST_ITEM}
          style={rankingStyles.skeleton}
          times={6}
        />
      ) : data?.ranking?.length ? (
        <>
          <View style={rankingStyles.currentUserContainer}>
            <Text style={rankingStyles.currentUserName}>
              {userData?.username}
            </Text>
            <View style={rankingStyles.currentUserStatsContainer}>
              <View style={[Layout.rowCenter]}>
                <View>
                  <Text style={rankingStyles.currentUserLabel}>Puesto</Text>
                  <Text style={rankingStyles.currentUserValue}>
                    {userData?.position ?? 'N/A'}
                  </Text>
                </View>
                <Avatar
                  size={48}
                  containerStyle={rankingStyles.currentUserAvatar}
                  animate
                  isOnline
                  imageProps={{ animationDuration: 1000 }}
                  labelColor={Colors.white}
                  backgroundColor={Colors.red}
                  source={{ uri: userData?.picture }}
                  label={getNameInitials(userData?.username)}
                />
                <View>
                  <Text style={rankingStyles.currentUserLabel}>Objetivo</Text>
                  <Text style={rankingStyles.currentUserValue}>
                    {userData?.percentage ?? '-'}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 70 }}
          >
            {data?.ranking.map((item, index) => {
              const isFirstUser = index === 0;
              const firstContainerStyles = isFirstUser
                ? rankingStyles.firstUserContainer
                : {};
              return (
                <View
                  key={index}
                  style={{
                    ...rankingStyles.row,
                    backgroundColor: isFirstUser ? Colors.red : 'transparent',
                    ...firstContainerStyles,
                  }}
                >
                  <Text
                    style={{
                      ...rankingStyles.rowNumber,
                      color: isFirstUser ? Colors.white : Colors.black,
                    }}
                  >
                    {index + 1}
                  </Text>
                  <Avatar
                    size={35}
                    containerStyle={rankingStyles.listAvatar}
                    animate
                    isOnline
                    imageProps={{ animationDuration: 1000 }}
                    labelColor={isFirstUser ? Colors.red : Colors.white}
                    backgroundColor={isFirstUser ? Colors.white : Colors.red}
                    source={{ uri: item.picture }}
                    label={getNameInitials(item.username)}
                  />
                  <Text
                    style={{
                      ...rankingStyles.rowName,
                      fontWeight: isFirstUser ? '700' : '400',
                      color: isFirstUser ? Colors.white : Colors.black,
                    }}
                  >
                    {item.username}
                  </Text>
                  <Text
                    style={{
                      ...rankingStyles.rowPercentage,
                      fontWeight: isFirstUser ? '900' : '400',
                      color: isFirstUser ? Colors.white : Colors.red,
                    }}
                  >
                    {item.percentage}%
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <View style={[Layout.fill, Layout.colCenter]}>
          <Card.Title
            style={[Layout.colCenter]}
            title="No hay informacion para mostrar"
            titleStyle={{ textAlign: 'center' }}
            subtitle="¡Comienza a medirte para participar del ranking!"
            subtitleStyle={{
              fontSize: 14,
            }}
          />
        </View>
      )}
    </>
  );
};

export default Ranking;
