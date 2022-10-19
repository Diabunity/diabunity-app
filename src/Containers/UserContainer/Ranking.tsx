import React from 'react';
import { Text, View, Avatar, SkeletonView } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { useTheme } from '@/Hooks';
import { getNameInitials } from '@/Utils';
import { userApi } from '@/Services/modules/users';
import { rankingStyles } from './styles';

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
              <View>
                <Text style={rankingStyles.currentUserLabel}>Puesto</Text>
                <Text style={rankingStyles.currentUserValue}>
                  {userData?.position ?? 'N/A'}
                </Text>
              </View>
              <Avatar
                size={48}
                containerStyle={rankingStyles.avatar}
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
              const isUserPosition = userPosition
                ? index === userPosition
                : false;

              return (
                <View
                  key={index}
                  style={{
                    ...rankingStyles.row,
                    backgroundColor: isUserPosition
                      ? Colors.red
                      : 'transparent',
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
      ) : (
        <Text>No hay información disponible</Text>
      )}
    </>
  );
};

export default Ranking;
