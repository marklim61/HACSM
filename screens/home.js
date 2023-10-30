import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';

const Home = ({ navigation }) => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>HACSM</Text>
      <TouchableOpacity
        style={globalStyles.alarmButton}
        onPress={() => navigation.navigate('SmokeChart')}
        underlayColor='#fff'>
        <Text style={globalStyles.alarmText}>Smoke</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.alarmButton}
        onPress={() => navigation.navigate('Temperature')}
        underlayColor='#fff'>
        <Text style={globalStyles.alarmText}>Temperature</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.alarmButton}
        onPress={() => Alert.alert('Button clicked')}
        underlayColor='#fff'>
        <Text style={globalStyles.alarmText}>Alarm</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.panicButton}
        onPress={() => Alert.alert('Button clicked')}
        underlayColor='#fff'>
        <Text style={globalStyles.panicText}>911</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  )
};

export default Home;