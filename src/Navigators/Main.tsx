import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { Toast, View } from 'react-native-ui-lib';
import {
  HomeContainer,
  HistoryContainer,
  UserContainer,
  AddMeasureContainer,
  CommunityContainer,
} from '@/Containers';
import { VIEW_NAMES } from '@/Constants/views';
import { useNotification } from '@/Hooks';
import { toggleNotification } from '@/Store/Notification';
import { store } from '@/Store';
import { TOAST_TIMEOUT } from '@/Constants';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

// @refresh reset
const MainNavigator = () => {
  const { visible, message, color, preset } = useNotification();

  return (
    <>
      <View style={styles.view}>
        <Toast
          visible={visible}
          autoDismiss={TOAST_TIMEOUT}
          position="top"
          backgroundColor={color}
          message={message}
          preset={preset}
          onDismiss={() =>
            store.dispatch(toggleNotification({ visible: false }))
          }
        />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tab,
        }}
      >
        <Tab.Screen
          name={VIEW_NAMES.HOME}
          component={HomeContainer}
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={VIEW_NAMES.ADD_MEASUREMENT}
          component={AddMeasureContainer}
          options={{
            title: 'Agregar',
            tabBarIcon: ({ color, size }) => (
              <Icon name="droplet" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={VIEW_NAMES.HISTORY}
          component={HistoryContainer}
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size }) => (
              <Icon name="rotate-ccw" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={VIEW_NAMES.COMMUNITY}
          component={CommunityContainer}
          options={{
            title: 'Comunidad',
            tabBarIcon: ({ color, size }) => (
              <Icon name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={VIEW_NAMES.PROFILE}
          component={UserContainer}
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    padding: 10,
    width: '100%',
    zIndex: 0,
    paddingBottom: 3,
    height: 55,
  },
  view: {
    zIndex: 3,
    elevation: 3,
    position: 'relative',
  },
});

export default MainNavigator;
