import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { default as React } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { router } from "expo-router";

function SignUp() {
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [profile_pic, setProfilePic] = React.useState(null);
  const [countries, setCountries] = React.useState([]);

  React.useEffect(() => {
    load_countries();
  }, []);

  async function load_countries() {
    try {
      const response = await fetch("http://192.168.8.101/react_chat/load_countries.php");
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  }

  const signUpUI = (
    <SafeAreaView style={styles.signUpContainer}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#fff"}></StatusBar>
      <ScrollView style={styles.scroll}>
        {/* select profile img */}
        <View style={styles.profileImgContainer}>
          <Pressable style={styles.imagePicker} onPress={test}>
            {profile_pic ? (
              <Image 
                source={{ uri: profile_pic.uri }} 
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Ionicons name="add" size={100} color="#DB5A5A" />
            )}
          </Pressable>
        </View>
        {/* select profile end */}
        {/* signup form */}
        <View style={styles.signupFormContainer}>
          <View style={styles.nameInputContainer}>
            <View style={styles.nameIconContainer}>
              <Ionicons name="person-outline" size={20} color="#666" />
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter Your Name"
              placeholderTextColor="#999"
              onChangeText={setName}
            />
          </View>
          <View style={styles.nameInputContainer}>
            <View style={styles.nameIconContainer}>
              <Ionicons name="call-outline" size={20} color="#666" />
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter Your Phone Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              onChangeText={setMobileNumber}
            />
          </View>
          <View style={styles.nameInputContainer}>
            <View style={styles.nameIconContainer}>
              <Ionicons name="eye-off-outline" size={20} color="#666" />
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter Your Password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.nameInputContainer}>
            <View style={styles.nameIconContainer}>
              <Ionicons name="eye-off-outline" size={20} color="#666" />
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter Your Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={styles.nameInputContainer}>
            <View style={styles.nameIconContainer}>
              <Ionicons name="earth-outline" size={20} color="#666" />
            </View>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Country" value="" />
              {countries.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
          <View>
            <Pressable style={styles.signUpBtn} onPress={SignUpRequest}>
              <Text style={styles.signUpBtnText}>Sign Up</Text>
            </Pressable>
            <View style={styles.loginRedirect}>
              <Text style={styles.loginRedirectText}>
                Already have an account?{" "}
                <Text
                  style={styles.loginRedirectLink}
                  onPress={() => router.push("./Signin")}
                >
                  Log in
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* signup form end*/}
    </SafeAreaView>
  );

  async function test() {
    const options = {
      mediaType: ["photo", "video"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled) {
      Alert.alert("Cancelled", "Image selection was cancelled");
    } else {
      // const content = result.assets[0].uri;
      // Alert.alert("Selected Image", content);

      const imgObject = {
        uri: result.assets[0].uri,
        name: "profileImage.png",
        type: "image/png",
      };
      setProfilePic(imgObject);
    }
  }

  function SignUpRequest() {
    // console.log("uploadProfileImg called with imgObject:", imgObject);
    var mobile = mobileNumber;
    var userName = name;
    var profile_img = profile_pic;
    var pass = password;
    var confirm_pass = confirmPassword;
    var country_select = country;

    var form = new FormData();
    form.append("mobile", mobile);
    form.append("user_name", userName);
    form.append("profile_img", profile_pic);
    form.append("password", pass);
    form.append("confirm_password", confirm_pass);
    form.append("country", country_select);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        if (request.responseText) {
          Alert.alert("Response", request.responseText);
          console.log(request.responseText);
        } else {
          console.log("error");
        }
      }
    };
    request.open("POST", "http://192.168.8.101/react_chat/signup.php", true);
    request.send(form);
  }
  return signUpUI;
}

export default SignUp;


