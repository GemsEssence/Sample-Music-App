import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../screens/login';
import SmsList from '../../screens/smsList';
import SignupScreen from '../../firebaseScreens/signUp';
import SignInScreen from '../../firebaseScreens/signIn';
import ForgotPasswordScreen from '../../firebaseScreens/ForgotPassword';
import SignUpScreenSupabase from '../../supabaseScreens/SignUpScreen';
import SignInScreenSupabase from '../../supabaseScreens/signInScreen';
import ForgotPasswordScreenSupabase from '../../supabaseScreens/ForgotPasswordScreen';
import FirstScreen from '../../screens/fiestScreen';
import MyMusicList from '../../supabaseScreens/myMusicList';
import SplashScreen from '../../screens/splash';
import PlaylistScreen from '../../supabaseScreens/PlaylistScreen';

const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="SmsList" component={SmsList} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="SignUpScreenSupabase"
          component={SignUpScreenSupabase}
        />
        <Stack.Screen
          name="SignInScreenSupabase"
          component={SignInScreenSupabase}
        />
        <Stack.Screen
          name="ForgotPasswordScreenSupabase"
          component={ForgotPasswordScreenSupabase}
        />
        <Stack.Screen name="MyMusicList" component={MyMusicList} />
        <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
