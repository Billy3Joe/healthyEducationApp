import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Share,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import HeaderBar from '../components/HeaderBar';
import BottomBar from '../components/BottomBar';

const CustomModal = ({ modalVisible, handleCloseModal }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Options</Text>
          <Pressable style={styles.modalOption} onPress={() => { /* Logic to delete post */ handleCloseModal(); }}>
            <Text style={styles.modalOptionText}>Supprimer</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={() => { /* Logic to save post */ handleCloseModal(); }}>
            <Text style={styles.modalOptionText}>Enregistrer</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={handleCloseModal}>
            <Text style={styles.modalOptionText}>Annuler</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const snapshot = await firebase.firestore().collection('posts').get();
      const fetchedPosts = [];

      for (const doc of snapshot.docs) {
        const postData = doc.data();
        const date = postData.date.toDate();

        const userSnapshot = await firebase.firestore().collection('users').doc(postData.user).get();
        
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();

          const commentsWithUserNames = await Promise.all(
            (postData.comments || []).map(async (comment) => {
              const commentUserSnapshot = await firebase.firestore().collection('users').doc(comment.user).get();
              if (commentUserSnapshot.exists) {
                const commentUserData = commentUserSnapshot.data();
                return {
                  ...comment,
                  userName: commentUserData.Name,
                  profileImage: commentUserData.Profile_Image,
                  date: comment.date.toDate(),
                };
              }
              return comment;
            })
          );

          const post = {
            id: doc.id,
            ...postData,
            date,
            user: {
              name: userData.Name,
              profileImage: userData.Profile_Image,
            },
            showCommentInput: false,
            comment: '',
            comments: commentsWithUserNames.sort((a, b) => b.date - a.date),
            showAllComments: false,
          };

          fetchedPosts.push(post);
        } else {
          console.error('Données utilisateur introuvables pour le post', doc.id);
        }
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPress = async () => {
    try {
      const searchQuery = searchText.trim().toLowerCase();
  
      if (searchQuery === '') {
        fetchPosts();
        setSearchResults([]);
        setSearchError(null);
      } else {
        const querySnapshot = await firebase
          .firestore()
          .collection('posts')
          .where('title', '>=', searchQuery)
          .where('title', '<=', searchQuery + '\uf8ff')
          .get();
  
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
  
        if (results.length === 0) {
          setSearchResults([]);
          setSearchError('Recette indisponible pour le moment.');
        } else {
          setSearchResults(results);
          setSearchError(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche dans Firebase :', error);
      setSearchError('Erreur lors de la recherche.');
    }
  };

  const handleCommentChange = (postId, text) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, comment: text };
        }
        return post;
      })
    );
  };

const handleCommentSubmit = async (postId) => {
  const post = posts.find((p) => p.id === postId);
  if (post && post.comment.trim()) {
    try {
      // Récupérer les informations de l'utilisateur actuel
      const user = firebase.auth().currentUser;
      const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
      const userData = userSnapshot.data();

      // Préparer le commentaire avec les détails de l'utilisateur
      const comment = {
        text: post.comment,
        user: user.uid, // ID utilisateur
        userName: userData.Name, // Nom de l'utilisateur
        profileImage: userData.Profile_Image, // Image de profil de l'utilisateur
        date: firebase.firestore.Timestamp.now(), // Date et heure actuelles
      };

      // Ajouter le commentaire à Firestore
      await firebase.firestore().collection('posts').doc(postId).update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment),
      });

      // Réinitialiser le champ de commentaire
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comment: '', // Réinitialiser le champ de commentaire
              comments: [...p.comments, comment] // Ajouter le nouveau commentaire à la liste des commentaires
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
    }
  }
};

  const handleCommentPress = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, showCommentInput: !post.showCommentInput };
        }
        return post;
      })
    );
  };

  const handleShowAllComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, showAllComments: !post.showAllComments };
        }
        return post;
      })
    );
  };

  const handleLikePress = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
          return { ...post, likes: updatedLikes, isLiked: !post.isLiked };
        }
        return post;
      })
    );
  };

  const handleSharePress = async (post) => {
    try {
      await Share.share({
        message: `${post.title} - ${post.description}`,
      });
    } catch (error) {
      console.log('Erreur lors du partage', error);
    }
  };

  const navigateToUserProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  const handleMoreOptionsPress = (postId) => {
    setSelectedPostId(postId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPostId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar namePage="Home"/>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <Ionicons name="search" size={24} color="orange" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.errorContainer}>
        {searchError && (
          <Text style={styles.errorText}>{searchError}</Text>
        )}
      </View>
  
      {loading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loader} />
      ) : (
        <ScrollView 
          style={styles.container} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {posts.length === 0 ? (
            <View style={styles.RecipeContainer}>
              <Text style={styles.RecipeText}>Soyez le premier/la première à partager votre recette saine.</Text>
              <Image source={require('../assets/logo.png')} />
              <Text style={styles.RecipeText}>Merci pour votre confiance.</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View style={styles.card} key={post.id}>
                <View style={styles.userContainer}>
                  <Image 
                    source={{ uri: post.user.profileImage }} 
                    style={styles.imageProfile} 
                    onError={(e) => console.log('Erreur de chargement de l\'image:', e.nativeEvent.error)}
                  />
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <TouchableOpacity onPress={() => handleMoreOptionsPress(post.id)}>
                    <Ionicons name="ellipsis-vertical" size={24} color="gray" style={styles.icon} />
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: post.imageURL }} style={styles.image} />
                <View style={styles.content}>
                  <Text style={styles.date}>Publié le {post.date.toLocaleDateString()} à {post.date.toLocaleTimeString()}</Text>
                  <Text style={styles.title}>{post.title}</Text>
                  <Text style={styles.description}>{post.content}</Text>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => handleCommentPress(post.id)}>
                      <Ionicons name="chatbubble-outline" size={24} color="gray" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLikePress(post.id)}>
                      <Ionicons
                        name={post.isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={post.isLiked ? "red" : "gray"}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <Text style={styles.likes}>{post.likes}</Text>
                    <TouchableOpacity onPress={() => handleSharePress(post)}>
                      <Ionicons name="share-social-outline" size={24} color="gray" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                  {post.showCommentInput && (
                    <View style={styles.commentContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Ajouter un commentaire..."
                        value={post.comment}
                        onChangeText={(text) => handleCommentChange(post.id, text)}
                      />
                      <TouchableOpacity onPress={() => handleCommentSubmit(post.id)}>
                        <Ionicons name="send" size={24} color="orange" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {post.comments.length > 0 && (
                    <View>
                      <TouchableOpacity onPress={() => handleShowAllComments(post.id)}>
                        <Text style={styles.commentCount}>
                          {post.showAllComments 
                            ? `Fermer (${post.comments.length})` 
                            : `Commentaires (${post.comments.length})`}
                        </Text>
                      </TouchableOpacity>
                      {post.comments.slice(0, post.showAllComments ? post.comments.length : 1).map((comment, index) => (
                        <View key={index} style={styles.comment}>
                          <Image 
                            source={{ uri: comment.profileImage }} 
                            style={styles.commentProfileImage} 
                            onError={(e) => console.log('Erreur de chargement de l\'image:', e.nativeEvent.error)}
                          />
                          <View style={styles.commentTextContainer}>
                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      <BottomBar navigation={navigation} />
      <CustomModal
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
  },
  loader: {
    marginTop: 20,
  },
  RecipeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  RecipeText: {
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  content: {
    marginTop: 10,
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  likes: {
    marginHorizontal: 5,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentText: {
    color: 'gray',
  },
  commentCount: {
    color: 'orange',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Home;
