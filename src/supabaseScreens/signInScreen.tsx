import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Header from '../components/header';
import InputBox from '../components/inputBox';
import Button from '../components/button';
import {supabase} from '../../lib/supabase';

export default function SignInScreenSupabase() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'MyMusicList'}],
      }),
    );

    setLoading(false);
  };

  const onPressForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreenSupabase');
  };

  const onPressSignUp = () => {
    navigation.navigate('SignUpScreenSupabase');
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header isShowBack={false} label={'SignIn'} />
      <InputBox
        placeholder="Enter Email"
        onChangeText={val => setEmail(val)}
        label="Email Address"
      />
      <InputBox
        placeholder="Enter Password"
        secureTextEntry
        onChangeText={setPassword}
        label="password"
      />
      <Button label="SignIn" onPressButton={handleSignIn} />

      <Pressable
        disabled
        onPress={onPressForgotPassword}
        style={styles.ForgotButton}>
        <Text>Forgot Password ?</Text>
      </Pressable>
      <Pressable onPress={onPressSignUp} style={styles.signUpButton}>
        <Text>do not have an accout ? signUP</Text>
      </Pressable>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  ForgotButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  signUpButton: {
    padding: 10,
  },
});
