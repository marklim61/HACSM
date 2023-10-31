import { NavigationContainer } from '@react-navigation/native'; // Needed for managing for app state and linking top-level navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack' // Needed for for app to transition between screens
import Home from './screens/home';
import Login from './screens/login';
import Navbar from './screens/navbar';
import { useFonts } from 'expo-font'; // Needed for loading custom fonts
import * as SplashScreen from 'expo-splash-screen'  // Needed to notify the user that the app is in the process of loading.
import { useEffect, useState } from 'react'; // Needed to update DOM
import WebSocketService from './services/WebSocketService';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [ipAddress, setIPAddress] = useState("");

  const [fontsLoaded] = useFonts({  // Load custom fonts
    "Gruppo-Regular": require("./assets/fonts/Gruppo-Regular.ttf"),
    "Monoton-Regular": require("./assets/fonts/Monoton-Regular.ttf"),
    "TiltPrism-Regular": require("./assets/fonts/TiltPrism-Regular.ttf")
  });

  useEffect(() => {
    async function prepare() {  // Prevents the default hiding of the splash screen
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []) // Pass an extra parameter, an empty array which values will cause this useEffect to run cause we only want to run it once

  if (!fontsLoaded) { // If fonts havent been loaded yet because if text is trying to be displayed, its not going to work out so return undefined
    return undefined;
  } else {
    SplashScreen.hideAsync(); // Manually hide the splash sceen once everything is loaded
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='Home'
          component={Home}
          options={{
            headerRight: () => <Navbar />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;