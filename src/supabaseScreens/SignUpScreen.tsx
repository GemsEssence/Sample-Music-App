import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
import Header from '../components/header';
import InputBox from '../components/inputBox';
import Button from '../components/button';

export default function SignUpScreenSupabase() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signUp({email, password});
    if (error) Alert.alert('Error', error.message);
    else
      Alert.alert('Success', 'Check your email for verification.', [
        {},
        {
          text: 'OK',
          onPress: () => goBack(),
        },
      ]);

    setLoading(false);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header onPressBack={goBack} label={'SignUp'} />
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
      <Button label="Sign Up" onPressButton={handleSignUp} />
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
});
