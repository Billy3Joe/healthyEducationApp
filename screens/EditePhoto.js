import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditePhoto = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState('');

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

        Alert.alert("Succès", "Image de profil mise à jour avec succès !", [
          {
            text: "OK",
            onPress: () => {
              setImage('');
              navigation.navigate('Profile');  // Remplace 'Profil' par le nom exact de ta route Profil si besoin
            }
          }
        ]);
      } else {
        Alert.alert("Erreur", "Veuillez sélectionner une image");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image de profil :', error.message);
      Alert.alert("Erreur", "Erreur lors de la mise à jour de l'image de profil. Veuillez réessayer.");
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Autorisation d'accéder à la galerie refusée");
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
      Alert.alert("Erreur", "Erreur lors de la sélection de l'image. Veuillez réessayer.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Éditer la photo</Text>
      </View>

      {/* Contenu principal dans ScrollView */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={{ color: '#888' }}>Aucune image sélectionnée</Text>
          </View>
        )}

        <TouchableOpacity style={styles.updateButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Sélectionner une image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleEditePhoto}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 24,
    color: 'green',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // pour éviter que le contenu soit caché par BottomBar
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    marginRight: 8,
  },
});

export default EditePhoto;
