import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/home';
import Login from './screens/login';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Gruppo-Regular": require("./assets/fonts/Gruppo-Regular.ttf"),
    "Monoton-Regular": require("./assets/fonts/Monoton-Regular.ttf"),
    "TiltPrism-Regular": require("./assets/fonts/TiltPrism-Regular.ttf")
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, [])

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
          />
        <Stack.Screen
          name = 'Home'
          component={Home}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
};
