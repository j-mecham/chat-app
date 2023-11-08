import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);
  const { name } = route.params;
  const { color } = route.params;
  const { userID } = route.params;
  

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: name + 'has joined the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

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

 return (
  <View style={[styles.container, {backgroundColor: color}]}>
    <GiftedChat
    messages={messages}
    renderBubble={renderBubble}
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