import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { BarChart } from 'react-native-chart-kit';
import WebSocketService from '../services/WebSocketService';

const Home = ({ navigation }) => {
  const [sensorData, setSensorData] = useState({
    Smoke: 0,
    Methane: 0,
    CO: 0,
    Temperature: 0,
    Humidity: 0
  });

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
      <BarChart
        data={{
          labels: ['Smoke', 'Methane', 'CO', 'Temperature', 'Humidity'],
          datasets: [
            {
              data: [Smoke, Methane, CO, Temperature, Humidity],
              color: (opacity = 1) => [
                `rgba(255, 99, 132, ${opacity})`, // Smoke: Red
                `rgba(75, 192, 192, ${opacity})`, // Methane: Green
                `rgba(54, 162, 235, ${opacity})`, // CO: Blue
                `rgba(255, 212, 86, ${opacity})`, // Temp: Yellow
                `rgba(255, 223, 76, ${opacity})`, // Humidity: Yellow
              ],
            },
          ],
        }}
        width={400}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Alarm Button */}
      <TouchableOpacity
        style={globalStyles.alarmButton}
        onPress={() => Alert.alert('Button clicked')}
        underlayColor='#fff'>
        <Text style={globalStyles.alarmText}>Alarm</Text>
      </TouchableOpacity>

      {/* Panic Button */}
      <TouchableOpacity
        style={globalStyles.panicButton}
        onPress={() => Alert.alert('Button clicked')}
        underlayColor='#fff'>
        <Text style={globalStyles.panicText}>911</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

export default Home;