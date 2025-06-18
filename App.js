import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import PostsUser from "./screens/PostsUser";
import Profile from "./screens/Profile";
import EditeName from "./screens/EditeName";
import EditeEmail from "./screens/EditeEmail";
import EditePhoto from "./screens/EditePhoto";
import FriendsList from "./screens/FriendsList";
import NewFriendsDiscover from './screens/NewFriendsDiscover';
import Posts from "./screens/CreatePost";
import SignIn from "./screens/Login";
import SignUp from "./screens/Signup";
import InitialPage from "./screens/InitialPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
       <NavigationContainer>
           <Stack.Navigator
              initialRouteName="InitialPage"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="InitialPage" component={InitialPage} />
              <Stack.Screen name="Signup" component={SignUp} />
              <Stack.Screen name="Login" component={SignIn} />
              <Stack.Screen
                options={{
                  animation: "none",
                  gestureEnabled: false,
                }}
                name="Home"
                component={Home}
              />
              <Stack.Screen name="CreatePost" component={Posts} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="EditeName" component={EditeName} />
              <Stack.Screen name="EditeEmail" component={EditeEmail} />
              <Stack.Screen name="EditePhoto" component={EditePhoto} />
              <Stack.Screen name="FriendsList" component={FriendsList} />
              <Stack.Screen name="NewFriendsDiscover" component={NewFriendsDiscover} />
              <Stack.Screen name="PostsUser" component={PostsUser} />
           </Stack.Navigator>
       </NavigationContainer>
      /*<View style={styles.container}>
        <Text>Healthy Education</Text>
        <StatusBar style="auto" />
      </View>*/
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
