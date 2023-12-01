import React, { useEffect } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/global';
import WebSocketService from '../services/WebSocketService';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleDisconnect = async () => {
    const webSocketService = WebSocketService.getInstance();
    webSocketService.close(); // Assuming you have a close method in your WebSocketService
    navigation.navigate('Login');
  };

  useEffect(() => {
    const { name } = route;

    if (name !== 'Login') {
      navigation.setOptions({
        gestureEnabled: false, // Avoid swiping back to Login
        headerBackVisible: false, // Get rid of the back button
        headerRight: () => (
          <TouchableOpacity onPress={() =>
            Alert.alert(
              'Disconnect',
              'Are you sure you want to disconnect?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Disconnect',
                  style: 'destructive',
                  onPress: () => handleDisconnect(),
                },
              ],
              { cancelable: false }
            )
          }>
            <Text style={globalStyles.logOutButton}>Disconnect</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, route]);

  return null;
};

export default Navbar;