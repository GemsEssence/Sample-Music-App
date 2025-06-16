import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

interface propsType {
  lable?: string;
  onPressBack?: () => void;
  isShowBack?: boolean;
  isShowRighIcon?: boolean;
  onPressRight?: () => void;
}

const Header: React.FC<propsType> = ({
  lable = '',
  onPressBack,
  isShowBack = true,
  isShowRighIcon = false,
  onPressRight
}) => {
  return (
    <View style={styles.container}>
      {isShowBack ? (
        <Pressable onPress={onPressBack}>
          <Image
            source={require('../../assest/images/back.png')}
            style={styles.backImage}
            tintColor={'#000'}
          />
        </Pressable>
      ) : (
        <View style={styles.rightView} />
      )}
      <Text style={styles.title}>{lable}</Text>
      {isShowRighIcon ? (
        <Pressable onPress={onPressRight}>
          <Image
            source={require('../../assest/images/upload.png')}
            style={styles.backImage}
            tintColor={'#000'}
          />
        </Pressable>
      ) : (
        <View style={styles.rightView} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  backImage: {
    height: 30,
    width: 30,
  },
  rightView: {
    height: 30,
    width: 30,
  },
});
