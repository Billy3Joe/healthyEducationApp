import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import * as ImagePicker from 'expo-image-picker';

const EditePhoto = () => {
  const [image, setImage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditePhoto = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      const storageRef = firebase.storage().ref();

      if (image !== '') {
        const filename = `${uid}_${Date.now()}.jpg`;
        const imageUri = image;

        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = storageRef.child(`images/${filename}`);
        await imageRef.put(blob);
        const imageURL = await imageRef.getDownloadURL();

        await firebase.firestore().collection('users').doc(uid).update({
          Profile_Image: imageURL,
        });

        console.log('Image de profil mise à jour avec succès');

        setImage('');
        setConfirmationMessage('Image de profil mise à jour avec succès');
        setTimeout(() => {
          setConfirmationMessage('');
        }, 3000);
      } else {
        setErrorMessage('Veuillez sélectionner une image');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image de profil :', error.message);
      setErrorMessage('Erreur lors de la mise à jour de l\'image de profil. Veuillez réessayer.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log("Autorisation d'accéder à la galerie refusée");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image :', error.message);
      setErrorMessage('Erreur lors de la sélection de l\'image. Veuillez réessayer.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Sélectionner une image</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={styles.updateButton} onPress={handleEditePhoto}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
        {confirmationMessage ? (
          <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
      <BottomBar namePage="CreatePost" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  updateButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
  },
  confirmationMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default EditePhoto;
