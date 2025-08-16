import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as React, useEffect } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { router, useLocalSearchParams } from "expo-router";


function Chat() {
  const params = useLocalSearchParams();
  const otherUserId = params.userId;

  const [chatText, setChatText] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState("");
  const [loadData, setChat] = React.useState([]);
  const [name, setName] = React.useState("");


  async function getUserName() {
    try {
      var userJsonText = await AsyncStorage.getItem("user");
      if (!userJsonText) return;
      
      var userJsonObject = JSON.parse(userJsonText);
      setCurrentUserId(userJsonObject.id);
      setName(userJsonObject.name);

    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  function setUnseenStatus(otherUserId) {
      var form = new FormData();
      form.append("other_user_id", otherUserId);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        loadChatMessages();
      }
    };
    request.open("POST", "http://192.168.8.101/react_chat/set_unseen_status.php", true);
    request.send(form);
  }

  async function loadChatMessages() {
    if (!otherUserId || !currentUserId) return;
    
    try {
      var formData = new FormData();
      formData.append("otherUserId", otherUserId);
      formData.append("currentUserId", currentUserId);

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var response = request.responseText;
          var responseJsonArray = JSON.parse(response);
          setChat(responseJsonArray);
        }
      };
      request.open("POST", "http://192.168.8.101/react_chat/load_chat.php", true);
      request.send(formData);
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  }

    getUserName();

    if (currentUserId && otherUserId) {
      setUnseenStatus(otherUserId);
      loadChatMessages();
    }
  const rendermessages = ({ item }) => {
    
    const messageStyle =
      item.side === "right" ? styles.msgContainer : styles.msgContainer1;
    return (
      <View style={messageStyle}>
        <Text style={styles.msgText}>{item.msg}</Text>
        <Text style={styles.msgTime}>{item.time}</Text>
        {item.side === "right" && (
          <View>
            <Ionicons 
              name="checkmark-done" 
              size={20} 
              color={item.status === "2" ? "#007AFF" : "#999"}
            />
          </View>
        )}
      </View>
    );
  };
  const ui = (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}
        onPress={() => router.push("/(tabs)/Home")}
        >
          <MaterialIcons name="arrow-back" size={30} />
        </Pressable>

        <View style={styles.headerCenter}>
          {/* icon */}
          <View style={styles.avatar}>
            <View style={styles.atomIcon}>
              <View style={styles.nucleus} />
              <View style={[styles.orbit, styles.orbit1]} />
              <View style={[styles.orbit, styles.orbit2]} />
              <View style={[styles.orbit, styles.orbit2]} />
              <View style={[styles.orbit, styles.orbit3]} />
            </View>
          </View>
        </View>
        {/* icon end */}
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSubtitle}>{name}</Text>
        </View>
        <Pressable style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={25} />
        </Pressable>
      </View>
      {/* header end */}
      {/* message with flatlist */}

      <FlatList
        data={loadData}
        renderItem={rendermessages}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        style={styles.msgsContainer}
        contentContainerStyle={styles.messagesContentContainer}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      {/* message body end */}
      {/* input area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Your Message"
            placeholderTextColor="#F6685E"
            value={chatText}
            onChangeText={setChatText}
          />
          <Pressable style={styles.sendButton} onPress={saveChat}>
            <MaterialIcons name="send" size={24} color="#5E6EF6" />
          </Pressable>
        </View>
      </View>
      {/* input area end */}
    </SafeAreaView>
  );

  async function saveChat() {
    if (!chatText.trim()) return;
    
    try {
      var userJsonText = await AsyncStorage.getItem("user");
      var fromUserJsonObject = JSON.parse(userJsonText);

      var requestObject = {
        "from_user_id": fromUserJsonObject.id,
        "to_user_id": otherUserId,
        "msg": chatText
      }
      var form = new FormData();
      form.append("requestJSON", JSON.stringify(requestObject));

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          setChatText("");
          loadChatMessages();
        }
      };
      request.open("POST", "http://192.168.8.101/react_chat/save_chat.php", true);
      request.send(form);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  return ui;
}
export default Chat;