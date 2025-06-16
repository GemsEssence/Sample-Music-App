import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {data} = await supabase.auth.getSession();
    if (data.session) {
      // User is already logged in
      navigation.reset({
        index: 0,
        routes: [{name: 'MyMusicList'}],
      });
    }else{
      navigation.navigate('SignInScreenSupabase')
    }
  };

  return <View></View>;
};

export default SplashScreen;

const styles = StyleSheet.create({});
