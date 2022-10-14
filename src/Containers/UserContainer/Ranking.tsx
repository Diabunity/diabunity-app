import React from 'react';
import { Text, View, Avatar } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { useTheme } from '@/Hooks';
import { getNameInitials } from '@/Utils';
import { generateTableStyles } from '../HistoryContainer/styles';

interface User {
  username: string;
  picture?: string;
  percentage: number;
  position?: number;
}

const data = {
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
  const styles = generateTableStyles(Colors);

  const userPosition = data.user_info.position;
  const userData: User = {
    ...data.ranking[userPosition - 1],
    position: userPosition,
  };
  return (
    <>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 16,
          lineHeight: 24,
          textAlign: 'center',
          color: '#666',
        }}
      >
        Ranking mensual
      </Text>
      <View
        style={{
          marginHorizontal: 21,
          shadowColor: '#000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            alignSelf: 'center',
            paddingTop: 10,
          }}
        >
          {userData.username}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.87)' }}>
              Puesto
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: Colors.red,
                fontWeight: '900',
              }}
            >
              {userData.position}
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
            source={{ uri: userData.picture }}
            label={getNameInitials(userData.username)}
          />
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.87)' }}>
              Objetivo
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: Colors.red,
                fontWeight: '900',
              }}
            >
              {userData.percentage}%
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {data.ranking.map((item, index) => {
          const isUserPosition = index === userPosition - 1;

          return (
            <View
              key={index}
              style={{
                ...styles.row,
                paddingHorizontal: 20,
                backgroundColor: isUserPosition ? Colors.red : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: isUserPosition ? Colors.white : Colors.black,
                }}
              >
                {index + 1}
              </Text>
              <Avatar
                size={35}
                containerStyle={{
                  marginVertical: 15,
                  marginLeft: 16,
                  marginRight: 13,
                }}
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
                  fontSize: 16,
                  fontWeight: isUserPosition ? '700' : '400',
                  color: isUserPosition ? Colors.white : Colors.black,
                }}
              >
                {item.username}
              </Text>
              <Text
                style={{
                  marginLeft: 'auto',
                  fontSize: 14,
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
