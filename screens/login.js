import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StatusBar } from "react-native";
import { globalStyles } from "../styles/global";
import WebSocketService from "../services/WebSocketService";

const DismissKeyboard = ({ children }) => ( // Needed so we can remove keyboard display if we need to by pressing the background
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const Login = ({ navigation }) => {
  // const [socket, setSocket] = useState(null); // State to hold the websocket connection object
  const [connected, setConnected] = useState(false); // State to check if the websocket connection is currently open or closed
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => { // Hook is set up to run the callback function whenever conneced and socket values change
    const webSocketService = WebSocketService.getInstance();

    // Add a listener for connection status changes
    const connectionStatusListener = (status) => {
      setConnected(status);
      if (status) {
        navigation.navigate('Home');
      }
    };

    // Subscribe to connection status changes
    webSocketService.subscribeToConnectionStatus(connectionStatusListener);

    return () => {
      // Unsubscribe when the component unmounts
      webSocketService.unsubscribeFromConnectionStatus(connectionStatusListener);
    };
  }, [navigation]);

  const connectToServer = async () => {
    const webSocketService = WebSocketService.getInstance();

    if (connected) { // Check if connected already to avoid continuous connection attempts
      alert("Already connected");
      navigation.navigate('Home');
      return;
    }

    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; // IP address format
    if (!ipRegex.test(ipAddress)) {
      // Invalid Ip address format
      alert("Please enter a valid IP address");
      return;
    }
    // Make websocket connection
    webSocketService.connect(ipAddress);
  };

  return (
    <DismissKeyboard>
      <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>HACSM</Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="ESP32 IP Address"
          keyboardType="numeric"
          onChangeText={(text) => setIpAddress(text)} // Set the ip address based on user's input
        />
        <TouchableOpacity
          style={globalStyles.connectScreenButton}
          onPress={connectToServer}
          underlayColor='#fff'>
          <Text style={globalStyles.loginText}>Connect</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </DismissKeyboard>
  )
};

export default Login;