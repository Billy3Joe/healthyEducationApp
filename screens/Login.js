import React, { useState, useRef } from 'react';
import { 
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ImageBackground,
  StatusBar
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Login = () => {
  const navigation = useNavigation();    
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const auth = firebase.auth();

  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(email, Password)
      .then((userCredential) => {
        // Connexion réussie
        console.log("Successful sign-in");
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log("Error during sign-in:", error);
        Alert.alert("Error", "Invalid email or password");
      });
  };

  return (
    <ImageBackground 
      source={require('../assets/images/imgSignin.webp')} 
      style={styles.imageBackground}
    >
      <StatusBar style="auto" />
      <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
        <View style={{ marginTop: 120, width: 300, height: 150, alignItems: "center" }}>
          <Text style={[styles.textTitle, styles.shadowProp]}>Login Form</Text>
          <Text style={styles.textSubTitle}>We're so excited to see you again!</Text>
        </View>
        <View>
          <Text style={styles.textAccountInformation}>ACCOUNT INFORMATION</Text>
          <TextInput
            placeholder="Email"
            autoFocus={true}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <View>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="white"
            style={[styles.item, styles.shadowProp]}
            onPress={handleSignIn}
          >
            <Text style={{ fontWeight: "bold" }}>Login</Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={styles.signUpButon}
            onPress={() => navigation.navigate('SignUp')} // redirige vers page signup
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Go to Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  signUpButon: {
    textAlign: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textTitle: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textSubTitle: {},
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255, 0.3)",
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    height: 50,
    backgroundColor: "white",
    borderRadius: 3,
    fontSize: 13,
  },
  textAccountInformation: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: 'center',
  },
  item: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // corrigé rgba valide
    borderRadius: 3,
    marginBottom: 20,
  },
});

export default Login;
