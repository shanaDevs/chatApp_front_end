import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { default as React, useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

const ChatItem = ({ item, currentUserId }) => {
  // console.log(item);
  const chatPartnerId = item.user_to_id;
  const userFromId = currentUserId;
  const unseenCount = item.count || 0;

  return (
    <Pressable
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: '/(tabs)/Chat',
        params: { userId: chatPartnerId, userFromId }
      })}
    >
      {/* avatar */}
      <View style={styles.avatar2}>
        <Image
          style={styles.logoImage}
          source={{
            uri: item.img ? item.img : "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
          }}
        />

      </View>
      {/* avatar end*/}
      {/* content */}
      <View style={styles.chatContent}>
        <View style={styles.chatContentHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.chatTime}>{item.time}</Text>
            {unseenCount > 0 && (
              <View style={styles.unseenCountCircle}>
                <Text style={styles.unseenCountText}>
                  {unseenCount > 9 ? '9+' : unseenCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.chatContentMessage}>{item.msg || "No messages yet"}</Text>
          {item.msg && (
            <Ionicons 
              name="checkmark-done" 
              size={16} 
              color={unseenCount === 0 ? "#007AFF" : "#999"} 
              style={styles.messageCheckmark}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const makeConversation = ({ item, currentUserId }) => <ChatItem item={item} currentUserId={currentUserId} />;

function Home() {
  const [data, setItem] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState(null);

  async function logout() {
    await AsyncStorage.removeItem("user");
    router.replace("/(tabs)/Signin");
  }

  async function friendList() {
    try {
      const usersJsonText = await AsyncStorage.getItem("user");
      if (!usersJsonText) return;
      
      const userObject = JSON.parse(usersJsonText);
      setCurrentUserId(userObject.id);

      const formData = new FormData();
      formData.append("userJsonText", usersJsonText);

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          setItem(JSON.parse(request.responseText));
        }
      };
      request.open(
        "POST",
        "http://192.168.8.101/react_chat/load_users.php",
        true
      );
      request.send(formData);
    } catch (error) {
      console.error("Error loading friend list:", error);
    }
  }

  useEffect(() => {
    friendList();
  }, []);

  const chatUI = (
    <SafeAreaView style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Chat History</Text>
        <Pressable onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} />
          <TextInput
            style={styles.searchBarText}
            placeholder="Search chats"
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => makeConversation({ item, currentUserId })}
        keyExtractor={(item, index) => `chat_${index}`}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        
      />
    </SafeAreaView>
  );
  return chatUI;
}

export default Home;
