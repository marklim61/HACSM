import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { globalStyles } from '../styles/global';
import { BarChart } from 'react-native-chart-kit';
import WebSocketService from '../services/WebSocketService';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications'
import { MaterialIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

const Home = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  // console.log(width);

  const [sensorData, setSensorData] = useState({
    Smoke: 0,
    Methane: 0,
    CO: 0,
    Temperature: 0,
    Humidity: 0
  });

  const [notificationSent, setNotificationSent] = useState({
    Smoke: false,
    Methane: false,
    CO: false,
    Temperature: false,
  });
  
  const handleAlarmPress = () => {
    const webSocketService = WebSocketService.getInstance();
    
    // Define the message you want to send
    const alarmMessage = {
      type: 'Turn off alarm',
      // Add any other relevant information in the message
    };
  
    // Send the message to the ESP32
    webSocketService.sendMessage(JSON.stringify(alarmMessage));
  };

  const handlePanicPress = () => {
    // Use Linking to open the browser with the specified URL
    Linking.openURL('https://calendar.google.com/calendar/u/0/selfsched?sstoken=UUw5YVJHNEU0eTdYfGRlZmF1bHR8YTJhOWU1OGJhNzNiYTg2YWNkM2MwNmZkYjI3YThhZDU'); // Replace with the actual URL
  };

  const handleDisconnect = async () => {
    const webSocketService = WebSocketService.getInstance();
    // webSocketService.close(); // Assuming you have a close method in your WebSocketService
    // navigation.navigate('Login');
    try {
      await webSocketService.close();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error disconnecting:', error);
      // Handle the error gracefully
    }
  };

  const sendDangerNotification = (message) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Danger Alert!',
        body: message,
      },
      trigger: null, // Send immediately
    });
  };

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();

    const getNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    getNotificationPermission();

    const handleWebSocketMessage = (message) => {
      console.log('Raw WebSocket message:', message);

      try {
        if (typeof message === 'string' && message.trim().startsWith('{')) {
          const parsedMessage = JSON.parse(message);

          if (parsedMessage && typeof parsedMessage === 'object') {
            console.log('Parsed Message:', parsedMessage);
            setSensorData((prevState) => ({
              ...prevState,
              Smoke: parseFloat(parsedMessage.Smoke) || 0,
              Methane: parseFloat(parsedMessage.Methane) || 0,
              CO: parseFloat(parsedMessage.CO) || 0,
              Temperature: parseFloat(parsedMessage.Temperature) || 0,
              Humidity: parseFloat(parsedMessage.Humidity) || 0,
            }));

            // Check if Smoke level is above 100 ppm and a notification hasn't been sent recently
            if (parseFloat(parsedMessage.Smoke) >= 100 && !notificationSent.Smoke) {
              sendDangerNotification(`Smoke level is above 100 ppm!`);
              setNotificationSent((prevState) => ({ ...prevState, Smoke: true }));
              Alert.alert('Danger Alert!', 'Smoke level is above 100 ppm!');
            } else if (parseFloat(parsedMessage.Smoke) < 100) {
              // Reset the state when Smoke level goes below the threshold
              setNotificationSent((prevState) => ({ ...prevState, Smoke: false }));
            }

            // Check if Methane level is above 1000 ppm and a notification hasn't been sent recently
            if (parseFloat(parsedMessage.Methane) >= 1000 && !notificationSent.Methane) {
              sendDangerNotification('Methane level is above 1000 ppm!');
              setNotificationSent((prevState) => ({ ...prevState, Methane: true }));
              Alert.alert('Danger Alert!', 'Methane level is above 1000 ppm!');
            } else if (parseFloat(parsedMessage.Methane) < 1000) {
              // Reset the state when Methane level goes below the threshold
              setNotificationSent((prevState) => ({ ...prevState, Methane: false }));
            }

            // Check if CO level is above 50 ppm and a notification hasn't been sent recently
            if (parseFloat(parsedMessage.CO) >= 50 && !notificationSent.CO) {
              sendDangerNotification('CO level is above 50 ppm!');
              setNotificationSent((prevState) => ({ ...prevState, CO: true }));
              Alert.alert('Danger Alert!', 'CO level is above 50 ppm!');
            } else if (parseFloat(parsedMessage.CO) < 50) {
              // Reset the state when CO level goes below the threshold
              setNotificationSent((prevState) => ({ ...prevState, CO: false }));
            }

            // Check if Temperature is above 100°F and a notification hasn't been sent recently
            if (parseFloat(parsedMessage.Temperature) >= 100 && !notificationSent.Temperature) {
              sendDangerNotification('Temperature is above 100°F!');
              setNotificationSent((prevState) => ({ ...prevState, Temperature: true }));
              Alert.alert('Danger Alert!', 'Temperature is above 100°F!');
            } else if (parseFloat(parsedMessage.Temperature) < 100) {
              // Reset the state when Temperature goes below the threshold
              setNotificationSent((prevState) => ({ ...prevState, Temperature: false }));
            }
          }
        }
      } catch (error) {
        console.error('Error handling received message:', error);
      }
    };

    // Subscribe to receive sensor data
    webSocketService.subscribeToSensorData(handleWebSocketMessage);

    // Subscribe to connection status changes
    const connectionStatusListener = (status) => {
      console.log('Connection status changed:', status);
      if (status) {
        navigation.navigate('Home');
      }
    };

    webSocketService.subscribeToConnectionStatus(connectionStatusListener);

    // Cleanup WebSocket connection on component unmount
    return () => {
      // Unsubscribe when the component unmounts
      webSocketService.unsubscribeFromConnectionStatus(handleWebSocketMessage);
      webSocketService.unsubscribeFromSensorData(handleWebSocketMessage);
    };
  }, [navigation, notificationSent]);

  const { Smoke, Methane, CO, Temperature, Humidity } = sensorData;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>HACSM</Text>

      {/* Bar Chart */}
      <View style={globalStyles.chartContainer}>
        <BarChart
          data={{
            labels: ['Smoke (ppm)', 'Methane (ppm)', 'CO (ppm)', 'Temperature (°F)', 'Humidity (%)'],
            datasets: [
              {
                data: [Smoke, Methane, CO, Temperature, Humidity],
                colors: [
                  (opacity = 1) => '#3c3c3c',
                  (opacity = 1) => '#d2d2d2',
                  (opacity = 1) => '#787878',
                  (opacity = 1) => '#ff0000',
                  (opacity = 1) => '#0000ff',
                ]
              },
            ],
          }}
          width={width - 45}
          height={width - 70}
          yAxisLabel= ""// Remove y-axis label
          yAxisSuffix=""
          yAxisInterval={1}
          withInnerLines={false} // hide the grid behind chart
          withHorizontalLabels={false} // hide horizontal labels
          showValuesOnTopOfBars={true} // Display data values on top of bars
          showBarTops={false}
          verticalLabelRotation={0}
          xLabelsOffset={0}
          withCustomBarColorFromData={true}
          flatColor={true}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            barRadius: 5,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 20,
            },
          }}
          style={{
            borderRadius: 16,
            paddingRight: 70,
            paddingTop: 100,
            marginLeft: 75,
            marginBottom: 100,
          }}
        />
      </View>

      {/* Buttons Container */}
      <View style={globalStyles.buttonsContainer}>
        {/* Alarm Button */}
        <TouchableOpacity
          style={globalStyles.alarmButton}
          onPress={handleAlarmPress}
          underlayColor='#fff'>
          < MaterialIcons name="alarm-off" size={24} color="white" style={{ fontWeight: 'bold', fontSize: 30 }} />
          {/* <Text style={globalStyles.alarmText}>Alarm Off</Text> */}
        </TouchableOpacity>

        {/* Disconnect Button */}
        <TouchableOpacity
            style={globalStyles.disconnectButton}
            onPress={() => 
              Alert.alert(
                'Warning!',
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
              )}
            underlayColor='#fff'>
            < AntDesign name="logout" size={24} color="white" style={{ fontWeight: 'bold', fontSize: 30 }} />
            {/* <Text style={globalStyles.disconnectText}>Disconnect</Text> */}
          </TouchableOpacity>
      </View>

      {/* Panic Button */}
      <TouchableOpacity
          style={globalStyles.panicButton}
          onPress={handlePanicPress}
          underlayColor='#fff'>
          
          <Text style={globalStyles.panicText}>911</Text>
        </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default Home;