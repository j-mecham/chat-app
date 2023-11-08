import { useState } from 'react';
import { StyleSheet, Alert, View, Text, TextInput, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const bgImage = require('../assets/BGImage.png');
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Chat', {userID: result.user.uid, name: name, color: bgColor});
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <ImageBackground 
      source={bgImage}
      resizeMode='cover'
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder='Type your username here'
        />
        <Text style={styles.text}>Choose your background color:</Text>
        <View style={styles.bgColorsView}>
          {colors.map((color, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.bgColors, { backgroundColor: color }, bgColor === color && styles.selected,]} 
              onPress={() => setBgColor(color)} 
            />
          ))}
        </View> 
        <TouchableOpacity
          style={styles.startButton}
          onPress={signInUser}
        >
          <Text style={styles.startText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: "#757083",
    width: "88%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 20
  },
  startText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  container: {
    width: "88%",
    height: "44%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    width: "88%",
    height: 60,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 30
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 100,
    alignSelf: "flex-start",
    margin: 20,
    marginBottom: 0,
    marginTop: 0
  },
  bgImage: {
    height: "100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgColors: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10
  },
  bgColorsView: {
    flexDirection: "row",
    margin: 10,
    alignSelf: "left"
  },
  selected: {
    borderWidth: 5,
    borderColor: "#E6DDC5"
  }
});

export default Start;