import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '@/Hooks';
import { DIABETES_TIPS } from '@/Constants';

const Tips = () => {
  const { Layout, Colors } = useTheme();
  const [tip, setTip] = useState<
    | { initial: string; important: string; end: string; icon: string }
    | undefined
  >();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DIABETES_TIPS.length);
    setTip(DIABETES_TIPS[randomIndex]);
  }, []);

  return (
    <View>
      <Text
        style={{
          ...styles.title,
          color: Colors.darkGray,
        }}
      >
        Consejos
      </Text>
      <View
        style={{
          ...styles.container,
          ...styles.dropShadow,
          borderColor: Colors.gray,
          backgroundColor: Colors.white,
        }}
      >
        {tip ? (
          <View style={[Layout.colCenter]}>
            <Icon
              style={styles.icon}
              name={tip.icon}
              size={32}
              color={Colors.red}
            />
            <Text style={styles.textContainer}>
              {tip.initial}{' '}
              <Text style={styles.importantText}>{tip.important}</Text>{' '}
              {tip.end}
            </Text>
          </View>
        ) : (
          <ActivityIndicator
            style={styles.done}
            size="small"
            color={Colors.black}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
  },
  done: {
    fontSize: 16,
    marginTop: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderWidth: 0.5,
    marginTop: 15,
    padding: 20,
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  importantText: {
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 10,
  },
});

export default Tips;
