import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StatusBar } from "react-native";
import { globalStyles } from "../styles/global";

const DismissKeyboard = ({ children }) => ( // Needed so we can remove keyboard display if we need to by pressing the background
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const Login = ({navigation}) => {
  const [ipAddress, setIpAddress] = useState(""); // State to store the ESP32's IP address
  const [socket, setSocket] = useState(null); // State to hold the websocket connection object
  const [connected, setConnected] = useState(false); // State to check if the websocket connection is currently open or closed

  useEffect(() => { // Hook is set up to run the callback function whenever conneced and socket values change
    if (connected && socket) {
      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setConnected(false); // Set connected state to false when the WebSocket connection is close
      };
    }
  }, [connected, socket]);  // Dependency arrays that make sures the effect is re-run whenever there's a change

  const connectToServer = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) { // Check if connected already to avoid continuous connection atttempts
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

    const newSocket = new WebSocket(`ws://${ipAddress}:3000`); // When ip address is set, make websocket connection

    const connectionTimeout = setTimeout(() => {  // Set a timeout for the connection attempts
      newSocket.close();
      alert("Connection timeout. Please check the IP address and try again.");
    }, 500); // Adjust the timeout value as needed (in milliseconds)

    newSocket.onopen = () => {
      clearTimeout(connectionTimeout);  // Clear the timeout when the connection is opened
      setConnected(true); // Set connected state to true when the WebSocket connection is opened
      navigation.navigate('Home');
    };

    newSocket.onclose = (closeEvent) => {
      clearTimeout(connectionTimeout);
      if (!connected) { // If connection is not there, output an error message (If wrong ip address)
        console.error("WebSocket connection error:", closeEvent.reason || "Unknown error");
        alert("Failed to connect. Please check the IP address and try again.");
      }
    };

    newSocket.onerror = (error) => { // If there's an error in the connection, output an error message
      clearTimeout(connectionTimeout);
      console.error("WebSocket connection error:", error.reason || "Unknown error");
      alert("Failed to connect. Please check the IP address and try again.");
    };
    
    setSocket(newSocket); // Update socket state with the new websocket connection object
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