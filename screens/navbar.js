import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, Modal, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/global';
import WebSocketService from '../services/WebSocketService';

const Navbar = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

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
        headerTitle: null, // Hide the title
        // headerRight: () => (
        //   <TouchableOpacity onPress={() =>
        //     Alert.alert(
        //       'Disconnect',
        //       'Are you sure you want to disconnect?',
        //       [
        //         {
        //           text: 'Cancel',
        //           style: 'cancel',
        //         },
        //         {
        //           text: 'Disconnect',
        //           style: 'destructive',
        //           onPress: () => handleDisconnect(),
        //         },
        //       ],
        //       { cancelable: false }
        //     )
        //   }>
        //     <Text style={globalStyles.logOutButton}>Disconnect</Text>
        //   </TouchableOpacity>
        // ),
        headerTitle: '', // Set headerTitle to an empty string
      });
    }
  }, [navigation, route]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.buttonsContainer}>
        <TouchableOpacity onPress={() => setShowDisconnectModal(true)}>
          <Text style={globalStyles.logOutButton}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {/* Disconnect Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showDisconnectModal}
        onRequestClose={() => setShowDisconnectModal(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>Disconnect</Text>
            <Text style={globalStyles.modalText}>
              Are you sure you want to disconnect?
            </Text>
            <View style={globalStyles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowDisconnectModal(false)}
              >
                <Text style={globalStyles.modalCancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDisconnect();
                  setShowDisconnectModal(false);
                }}
              >
                <Text style={globalStyles.modalDisconnectButton}>
                  Disconnect
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Navbar;