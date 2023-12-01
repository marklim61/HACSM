import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { BarChart } from 'react-native-chart-kit';
import WebSocketService from '../services/WebSocketService';
import { Linking } from 'react-native';

const Home = ({ navigation }) => {
  const [sensorData, setSensorData] = useState({
    Smoke: 0,
    Methane: 0,
    CO: 0,
    Temperature: 0,
    Humidity: 0
  });

  const handleAlarmPress = () => {
    const webSocketService = WebSocketService.getInstance();
    
    // Define the message you want to send
    const alarmMessage = {
      type: 'alarm',
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

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();

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
  }, [navigation]);

  const { Smoke, Methane, CO, Temperature, Humidity } = sensorData;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>HACSM</Text>

      {/* Bar Chart */}
      <View style={globalStyles.chartContainer}>
        <BarChart
          data={{
            labels: ['Smoke (ppm)', 'Methane (%)', 'CO (ppm)', 'Temperature (°C)', 'Humidity (%)'],
            datasets: [
              {
                data: [Smoke, Methane, CO, Temperature, Humidity],
                // color: (opacity = 100) => [
                //   `rgba(60, 60, 60, ${opacity})`,           // Smoke: Dark Gray
                //   `rgba(210, 210, 210, ${opacity})`,        // Methane: Light Gray (fixed the parenthesis)
                //   `rgba(120, 120, 120, ${opacity})`,        // CO: Medium Gray (fixed the parenthesis and removed extra parenthesis)
                //   `rgba(255, 0, 0, ${opacity})`,            // Temp: Red
                //   `rgba(0, 0, 255, ${opacity})`,            // Humidity: Blue
                // ],
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
          width={390}
          height={600}
          yAxisLabel= ""// Remove y-axis label
          yAxisSuffix=""
          yAxisInterval={1}
          withInnerLines={false} // hide the grid behind chart
          withHorizontalLabels={false} // hide horizontal labels
          showValuesOnTopOfBars={true} // Display data values on top of bars
          showBarTops={false}
          verticalLabelRotation={-90}
          xLabelsOffset={90}
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
            // marginVertical: -45,
            borderRadius: 16,
            paddingRight: 8,
            paddingLeft: 12,
            // marginBottom:-10,
            // marginTop: 10
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
          <Text style={globalStyles.alarmText}>Alarm</Text>
        </TouchableOpacity>

        {/* Panic Button */}
        <TouchableOpacity
          style={globalStyles.panicButton}
          onPress={handlePanicPress}
          underlayColor='#fff'>
          <Text style={globalStyles.panicText}>911</Text>
        </TouchableOpacity>
      </View>
      {/* Disconnect Button */}
      <TouchableOpacity
          style={globalStyles.disconnectButton}
          onPress={() => 
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
            )}
          underlayColor='#fff'>
          <Text style={globalStyles.logOutButton}>Disconnect</Text>
        </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default Home;