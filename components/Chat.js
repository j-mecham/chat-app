import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const { name } = route.params;
  const { color } = route.params;
  const { userID } = route.params;

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || '[]';
    setMessages(JSON.parse(cachedMessages));
  };

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });
    
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()), // convert createdAt to Date object })
          });
        });
        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // adds the new message to the displayed messages
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // customizes sender bubbles to be black and received bubbles to be white
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
   }

 return (
  <View style={[styles.container, {backgroundColor: color}]}>
    <GiftedChat
    messages={messages}
    renderBubble={renderBubble}
    renderInputToolbar={renderInputToolbar}
    onSend={messages => onSend(messages)}
    user={{
      _id: userID,
      name: name
    }}
    />
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
  </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;