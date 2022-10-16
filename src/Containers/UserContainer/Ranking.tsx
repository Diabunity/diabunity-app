import React from 'react';
import { Text, View, Avatar } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { useTheme } from '@/Hooks';
import { getNameInitials } from '@/Utils';
import { userApi } from '@/Services/modules/users';
import { rankingStyles } from './styles';

const fakeData = {
  ranking: [
    {
      username: 'Miguel Angel',
      picture: 'https://randomuser.me/api/portraits/med/men/75.jpg',
      percentage: 100,
    },
    {
      username: 'Ariel Gonzalez',
      picture: 'https://randomuser.me/api/portraits/med/men/74.jpg',
      percentage: 90,
    },
    {
      username: 'Juan Carlos',
      picture: 'https://randomuser.me/api/portraits/med/women/75.jpg',
      percentage: 80,
    },
    {
      username: 'Miguel Angel',
      picture: 'https://randomuser.me/api/portraits/med/men/76.jpg',
      percentage: 79,
    },
    {
      username: 'Ariel Gonzalez',
      picture: 'https://randomuser.me/api/portraits/med/men/77.jpg',
      percentage: 78,
    },
    {
      username: 'Juan Carlos',
      picture: 'https://randomuser.me/api/portraits/med/20.jpg',
      percentage: 77,
    },
    {
      username: 'Ariel Gonzalez',
      picture: 'https://randomuser.me/api/portraits/med/men/77.jpg',
      percentage: 76,
    },
    {
      username: 'Juan Carlos',
      picture: 'https://randomuser.me/api/portraits/med/20.jpg',
      percentage: 75,
    },
  ],
  user_info: {
    position: 5,
  },
};

const Ranking = () => {
  const { Colors } = useTheme();
  const { data, isFetching } = userApi.useFetchRankingQuery();

  const userPosition: number | null = data?.user_info?.position ?? null;
  const userData = userPosition
    ? {
        ...data?.ranking[userPosition],
        position: userPosition,
      }
    : null;

  return (
    <>
      <Text style={rankingStyles.title}>Ranking mensual</Text>
      <View style={rankingStyles.currentUserContainer}>
        <Text style={rankingStyles.currentUserName}>{userData?.username}</Text>
        <View style={rankingStyles.currentUserStatsContainer}>
          <View>
            <Text style={rankingStyles.currentUserLabel}>Puesto</Text>
            <Text style={rankingStyles.currentUserValue}>
              {userData?.position ?? 'N/A'}
            </Text>
          </View>
          <Avatar
            size={48}
            containerStyle={{
              marginTop: 6,
              marginBottom: 14,
              marginHorizontal: 47,
            }}
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
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {data?.ranking.map((item, index) => {
          const isUserPosition = userPosition ? index === userPosition : false;

          return (
            <View
              key={index}
              style={{
                ...rankingStyles.row,
                backgroundColor: isUserPosition ? Colors.red : 'transparent',
              }}
            >
              <Text
                style={{
                  ...rankingStyles.rowNumber,
                  color: isUserPosition ? Colors.white : Colors.black,
                }}
              >
                {index + 1}
              </Text>
              <Avatar
                size={35}
                containerStyle={rankingStyles.avatar}
                animate
                isOnline
                imageProps={{ animationDuration: 1000 }}
                labelColor={isUserPosition ? Colors.red : Colors.white}
                backgroundColor={isUserPosition ? Colors.white : Colors.red}
                source={{ uri: item.picture }}
                label={getNameInitials(item.username)}
              />
              <Text
                style={{
                  ...rankingStyles.rowName,
                  fontWeight: isUserPosition ? '700' : '400',
                  color: isUserPosition ? Colors.white : Colors.black,
                }}
              >
                {item.username}
              </Text>
              <Text
                style={{
                  ...rankingStyles.rowPercentage,
                  fontWeight: isUserPosition ? '900' : '400',
                  color: isUserPosition ? Colors.white : Colors.red,
                }}
              >
                {item.percentage}%
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default Ranking;
