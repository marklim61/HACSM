import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const { name } = route;

    if (name !== 'Login') {
      navigation.setOptions({
        gestureEnabled: false, // Avoid swiping back to Login
        headerBackVisible: false, // Get rid of the back button
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>Logout</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, route]);

  return null;
};

export default Navbar;