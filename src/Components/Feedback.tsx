import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { useTheme } from '@/Hooks';
import AuthService from '@/Services/modules/auth';
import { NavigationContainerRef } from '@react-navigation/native';
import { NavigatorParams } from '@/Navigators/Application';

const VISIBLE_ROUTES = ['Home', 'History', 'Add'];

const Feedback = ({
  navigationRef,
  currentRoute,
}: {
  navigationRef: React.RefObject<NavigationContainerRef<NavigatorParams>>;
  currentRoute?: string;
}) => {
  const user = AuthService.getCurrentUser();
  const { Colors } = useTheme();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const isVisible = !!user && VISIBLE_ROUTES.includes(currentRoute || '');
    setVisible(isVisible);
  }, [currentRoute]);

  return (
    <View>
      {visible && (
        <FAB
          icon="comment-text-outline"
          style={[styles.fab, { backgroundColor: Colors.red }]}
          small
          onPress={() => {
            navigationRef.current?.navigate('Feedback');
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    zIndex: 100,
    bottom: 50,
  },
});

export default Feedback;
