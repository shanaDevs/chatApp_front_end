import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as React } from "react";
import {
    Alert,
    Image,
    Pressable,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import styles from "./styles";
function SignIn() {
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signInUI = (
    <SafeAreaView style={styles.signInContainer}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImage}
            source={{
              uri: "https://www.shutterstock.com/shutterstock/photos/2278726727/display_1500/stock-vector-minimalistic-circular-logo-sample-vector-2278726727.jpg",
            }}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Welcome to LinkUp
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              marginBottom: 20,
              paddingHorizontal: 20,
              lineHeight: 24,
            }}
          >
            Please sign in to continue
          </Text>
          <View style={styles.inputContainer2}>
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color="#000"
              style={styles.mobileIcon}
            />
            <TextInput style={styles.mobileText} onChangeText={setMobile} />
          </View>
          <View style={styles.inputContainer2}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#000"
              style={styles.mobileIcon}
            />
            <TextInput
              style={styles.mobileText}
              secureTextEntry={true}
              onChangeText={setPassword}
            />

            <Pressable style={styles.eyeIcon}>
              <Ionicons name="eye-off-outline" size={20} color="#000" />
            </Pressable>
          </View>
          <Pressable style={styles.signInButton} onPress={signInProcess}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
          <Pressable style={styles.signUpButton}
          onPress={() => router.push('/(tabs)/Signup')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
  return signInUI;

  async function signInProcess() {
    var f = new FormData();
    f.append("mobile", mobile);
    f.append("password", password);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var jsonResponseText = request.responseText;
          var jsonResponseObject = JSON.parse(jsonResponseText);
          if (jsonResponseObject.status === "success") {
            Alert.alert("Welcome", jsonResponseObject.user.name);
            var userObject = jsonResponseObject.user;
            AsyncStorage.setItem("user", JSON.stringify(userObject));
            router.replace("/Home");
          } else {
            Alert.alert("Sign In Failed", jsonResponseObject.message);
          }
        } else {
          Alert.alert("Sign In Failed", `HTTP error: ${request.status}`);
        }
      }
    };
    request.open("POST", "http://192.168.8.101/react_chat/sign_in.php", true);
    request.send(f);
  }
}
export default SignIn;