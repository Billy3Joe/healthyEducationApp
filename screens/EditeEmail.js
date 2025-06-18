import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert, 
  StyleSheet
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const EditeEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEditEmail = () => {
    if (!email.trim()) {
      setError("L'email ne peut pas être vide.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    setError('');

    const uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(uid).update({
      Email: email
    })
    .then(() => {
      Alert.alert("Succès", "Email mis à jour avec succès !");
      navigation.goBack();
    })
    .catch((err) => {
      Alert.alert("Erreur", "Impossible de mettre à jour l'email : " + err.message);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier votre Email</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.editeButton} onPress={handleEditEmail}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomBar namePage="EditeEmail" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'green',
  },
  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  editeButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
  },
});

export default EditeEmail;
