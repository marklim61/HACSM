import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StatusBar, KeyboardAvoidingView } from "react-native";
import { globalStyles } from "../styles/global";
import WebSocketService from "../services/WebSocketService";

const DismissKeyboard = ({ children }) => ( // Needed so we can remove keyboard display if we need to by pressing the background
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const Login = ({ navigation }) => {
  const [connected, setConnected] = useState(false); // State to check if the websocket connection is currently open or closed
  const [hostname, setHostname] = useState("");
  const hostnameRef = useRef(null);

  useEffect(() => { // Hook is set up to run the callback function whenever conneced and socket values change
    const webSocketService = WebSocketService.getInstance();

    // Add a listener for connection status changes
    const connectionStatusListener = (status) => {
      setConnected(status);
      // Reset the hostname when disconnected
      if (!status) {
        setHostname("");
      }

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
  }, [navigation]);

  const connectToServer = async () => {
    const webSocketService = WebSocketService.getInstance();

    if (connected) { // Check if connected already to avoid continuous connection attempts
      alert("Already connected");
      return;
    }

    if (!hostname) {
      // Show an alert for an invalid hostname
      alert('Hostname cannot be empty.');
      return; // Exit the method to prevent further execution
    }

    // const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; // IP address format
    // if (!ipRegex.test(ipAddress)) {
    //   // Invalid Ip address format
    //   alert("Please enter a valid IP address");
    //   return;
    // }

    try {
      await webSocketService.connect(hostname);
  
      // Wait for a short duration to ensure the connection status is updated
      // This is a simple solution and might need adjustment based on your specific WebSocket implementation
      await new Promise(resolve => setTimeout(resolve, 500));
  
      if (webSocketService.isConnected()) {
        alert("Connected successfully!");
        setHostname("");
      } else {
        alert("Please enter the correct Hostname.");
      }
    } catch (error) {
      console.error('WebSocket connection error:', error);
  
      if (error.message.includes("Failed to construct 'WebSocket': The URL")) {
        alert("Please enter the correct Hostname.");
      } else {
        alert("Failed to connect. Please check the network and try again.");
      }
    }

    // Make websocket connection
    webSocketService.connect(hostname);
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
        </TouchableOpacity>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </DismissKeyboard>
  )
};

export default Login;