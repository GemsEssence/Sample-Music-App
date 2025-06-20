import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';

interface PropsType {
  label?: string;
  onPressBack?: () => void;
  isShowBack?: boolean;
  isShowRightIcon?: boolean;
  onPressRight?: () => void;
}

const Header: React.FC<PropsType> = ({
  label = '',
  onPressBack,
  isShowBack = true,
  isShowRightIcon = false,
  onPressRight,
}) => {
  return (
    <View style={styles.container}>
      {isShowBack ? (
        <Pressable onPress={onPressBack}>
          <Image
            source={require('../../assest/images/back.png')}
            style={styles.icon}
            tintColor="#000"
          />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.title}>{label}</Text>

      {isShowRightIcon ? (
        <Pressable onPress={onPressRight}>
          <Image
            source={require('../../assest/images/upload.png')}
            style={styles.icon}
            tintColor="#000"
          />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
  },
  placeholder: {
    height: 30,
    width: 30,
  },
});
