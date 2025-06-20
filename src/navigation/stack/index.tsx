import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreenSupabase from '../../supabaseScreens/SignUpScreen';
import SignInScreenSupabase from '../../supabaseScreens/signInScreen';
import ForgotPasswordScreenSupabase from '../../supabaseScreens/ForgotPasswordScreen';
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
