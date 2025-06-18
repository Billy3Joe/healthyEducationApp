import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { useNavigation} from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import BottomBar from "../components/BottomBar";

// Exemple de données d'amis
const friendsData = [
  {
    id: '1',
    name: 'John Doe',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '2',
    name: 'Jane Smith ',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '3',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '4',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '5',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '6',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '7',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '8',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '9',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '10',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '11',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '12',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '13',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '14',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  {
    id: '15',
    name: 'Jane Smith',
    photo: require('../assets/img-profiles/avatar.jpg'),
  },
  // Ajoutez d'autres amis ici...
];

const NewFriendsDiscover = () => {
  const navigation = useNavigation();
  const renderFriendItem = ({ item }) => (
    <View style={styles.friendContainer}>
      <View>
      <Image source={item.photo} style={styles.friendPhoto} />
        <Text></Text>
        <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Suivre</Text>
      </TouchableOpacity>
      </View>
      <Text style={styles.friendName}>{item.name}</Text>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons  onPress={() => navigation.navigate('Home')} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Propositions d'amis</Text>
      </View>
      <View style={styles.centerContainer}>
        <FlatList
          data={friendsData}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.footer}>
        <BottomBar namePage="Home" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap:10,
  },
  followButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default NewFriendsDiscover;
