// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox, Alert } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from "react";

// Create the navigator
const Stack = createNativeStackNavigator();


const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD-lZrM_eEBlmigoTndlVYQN5CNo45k0Y8",
    authDomain: "chat-app-5c521.firebaseapp.com",
    projectId: "chat-app-5c521",
    storageBucket: "chat-app-5c521.appspot.com",
    messagingSenderId: "385558203484",
    appId: "1:385558203484:web:978c1ab9adea6066206a99",
    measurementId: "G-8MYCHHDMM1"
  };

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
         name="Chat"
       >
         {props => <Chat db={db} {...props} isConnected={connectionStatus.isConnected} />}
       </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
