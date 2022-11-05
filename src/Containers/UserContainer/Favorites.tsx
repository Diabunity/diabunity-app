import React from 'react';
import { Text } from 'react-native-ui-lib';
import CommunityContainer from '../CommunityContainer';

import { favoriteStyles } from './styles';

const Favorites = () => (
  <>
    <Text style={favoriteStyles.title}>Favoritos</Text>
    <CommunityContainer navigation={{}} favoriteSection />
  </>
);

export default Favorites;
