import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  Alert
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const EditeName = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const handleEditName = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        return;
      }

      await firebase.firestore().collection('users').doc(user.uid).update({
        Name: name
      });

      Alert.alert("Succès", "Nom mis à jour avec succès !");
      navigation.goBack();

    } catch (error) {
      console.log("Erreur lors de la mise à jour du nom:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le nom");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier votre nom</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TouchableOpacity style={styles.editeButton} onPress={handleEditName}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <BottomBar namePage="EditeName" />
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

export default EditeName;
