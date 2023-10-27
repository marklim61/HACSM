import React from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Keyboard } from "react-native";
import { globalStyles } from "../styles/global";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default function Login({navigation}) {
    return (
      <DismissKeyboard>
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>HACSM</Text>
              <TextInput
                style={globalStyles.textInput}
                //onChangeText={onChangeNumber}
                //value={number}
                placeholder="IP Address"
                keyboardType="numeric"
                />
              <TouchableOpacity
                style={globalStyles.connectScreenButton}
                onPress={() => navigation.navigate('Home')}
                underlayColor='#fff'>
                <Text style={globalStyles.loginText}>Connect</Text>
              </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
      </DismissKeyboard>  
    )
};