import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {
  HomeContainer,
  UserContainer,
  AddMeasureContainer,
} from '@/Containers';

const Tab = createBottomTabNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { paddingBottom: 3, height: 55 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddMeasureContainer}
        options={{
          title: 'Agregar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="droplet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserContainer}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
