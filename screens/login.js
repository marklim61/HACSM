import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StatusBar, KeyboardAvoidingView, Alert } from "react-native";
import { globalStyles } from "../styles/global";
import WebSocketService from "../services/WebSocketService";
import { AntDesign } from '@expo/vector-icons'

const DismissKeyboard = ({ children }) => ( // Needed so we can remove keyboard display if we need to by pressing the background
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const Login = ({ navigation }) => {
  const [hostname, setHostname] = useState("");
  const hostnameRef = useRef(null);

  useEffect(() => { // Hook is set up to run the callback function whenever conneced and socket values change
    const webSocketService = WebSocketService.getInstance();

    // Add a listener for connection status changes
    const connectionStatusListener = (status) => {
      // // Reset the hostname when disconnected
      // if (!status) {
      //   setHostname("");
      // }

      if (status) {
        navigation.navigate('Home');
      }
    };

    // Subscribe to connection status changes
    webSocketService.subscribeToConnectionStatus(connectionStatusListener);

    return () => {
      // Unsubscribe when the component unmounts
      webSocketService.unsubscribeFromConnectionStatus(connectionStatusListener);
      setHostname(""); // Reset the hostname when navigating back to this component
    };
  }, [navigation, setHostname]);

  const connectToServer = async () => {
    const webSocketService = WebSocketService.getInstance();

    if (!hostname) {
      // Show an alert for an invalid hostname
      alert('Hostname cannot be empty.');
      return; // Exit the method to prevent further execution
    }

    try {
      await webSocketService.connect(hostname);
  
      // Wait for a short duration to ensure the connection status is updated
      // This is a simple solution and might need adjustment based on your specific WebSocket implementation
      await new Promise(resolve => setTimeout(resolve, 500));
  
      if (webSocketService.isConnected()) {
        Alert.alert('Alert', 'Connected successfully!');
        setHostname("");
      } else {
        Alert.alert("ERROR", "Please enter the correct Hostname.");
      }
    } catch (error) {
      console.error('WebSocket connection error:', error);
  
      if (error.message.includes("Failed to construct 'WebSocket': The URL")) {
        alert("Please enter the correct Hostname.");
      } else if (error.message.includes("Connection timeout")) {
        alert("Connection timed out. Please check the network and try again.");
      } else {
        alert("Failed to connect. Please check the network and try again.");
      }
    }

  };

  const onChangeText = (text) => {
    setHostname(text);
  };

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView style={globalStyles.container} behavior="padding" enabled>
        <Text style={globalStyles.titleText}>HACSM</Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="ESP32 HOSTNAME"
          onChangeText={onChangeText}
          value={hostname}
          ref={hostnameRef}
        />
        <TouchableOpacity
          style={globalStyles.connectScreenButton}
          onPress={connectToServer}
          underlayColor='#fff'>
          <Text style={globalStyles.loginText}>Connect</Text>
          < AntDesign name="login" size={24} color="white" style={{ fontWeight: 'bold', fontSize: 30, paddingLeft: 45, padding: 10, paddingTop: -10 }} />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </DismissKeyboard>
  )
};

export default Login;