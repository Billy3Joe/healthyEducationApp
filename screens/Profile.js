import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const unsubscribe = firebase.firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          setUser(doc.data());
        } else {
          console.log("User document not found");
        }
      }, error => {
        console.error("Error retrieving user document:", error);
      });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Édition de l'utilisateur</Text>
        </View>

        <Image
          source={{ uri: user?.Profile_Image }}
          style={styles.profileImage}
        />
{/* 
        <View style={styles.editIconContainer}>
          <Ionicons name="pencil" size={20} color="white" />
        </View> */}

        <View style={styles.userInfoContainer}>
          <Text style={styles.name}>{user?.Name}</Text>
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.details}>{user?.Email}</Text>
        </View>

        <View style={styles.infosContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('EditePhoto')} style={styles.editButton}>
            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Image</Text>
            <MaterialIcons name="chevron-right" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('EditeName')} style={styles.editButton}>
            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Nom</Text>
            <MaterialIcons name="chevron-right" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('EditeEmail')} style={styles.editButton}>
            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Email</Text>
            <MaterialIcons name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BottomBar namePage="Home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 10,
    alignItems: 'center',
    paddingBottom: 80, // pour éviter que le contenu soit caché sous le footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  title: {
    fontSize: 25,
    color: 'green',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'green',
    borderRadius: 15,
    padding: 5,
  },
  userInfoContainer: {
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailContainer: {
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
  },
  infosContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  editButton: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
});
