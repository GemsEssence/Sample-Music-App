import React, {useState} from 'react';
import {ActivityIndicator, Alert, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
import Header from '../components/header';
import InputBox from '../components/inputBox';
import Button from '../components/button';
import axios from 'axios';
import {SUPABASE_URL} from '@env';

export default function ForgotPasswordScreenSupabase() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email.');
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/send-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      Alert.alert('opt-->>>', data?.otp);
      setLoading(false);
    } catch (error) {
      console.log('error-send otp>>>', error);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      return Alert.alert('Error', 'Please enter your email or OTP.');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${SUPABASE_URL}/verify-otp`,
        {email, otp},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setLoading(false);
    } catch (error) {
      console.log('verify otp error>>>', error.response?.data || error.message);
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header lable={'Forgot Password'} onPressBack={goBack} />
      <InputBox
        placeholder="Enter Email"
        onChangeText={val => setEmail(val)}
        lable="Email Address"
      />
      <Button lable="Reset Password" onPressButton={handleSendOtp} />

      <InputBox
        placeholder="Enter OPT"
        onChangeText={val => setOtp(val)}
        lable="OTP"
      />

      <Button lable="Reset Password" onPressButton={handleVerifyOtp} />

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
