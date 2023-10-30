import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SmokeChart = ({ route }) => {
  console.log('Route:', route);
  const { receivedMessages, xLabels } = route.params || {};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Smoke Chart</Text>
      <LineChart
        data={{
          labels: xLabels,
          datasets: [
            {
              data: (receivedMessages || []).map((msg) => parseFloat(msg.Smoke) || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Smoke: Red
            },
          ],
        }}
        width={400}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default SmokeChart;
