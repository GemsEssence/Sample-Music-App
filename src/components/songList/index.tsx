import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

interface propsType {
  item: any;
  onPressLike: (id: string) => void;
  playPause: (item: any) => void;
  onPressAdd: (id: string) => void;
  isShowAdd?: boolean;
  isShowLike?: boolean;
}

const SongList: React.FC<propsType> = ({
  item,
  onPressLike,
  playPause,
  onPressAdd,
  isShowAdd = true,
  isShowLike = true,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
      }}>
      <Pressable
        onPress={() => playPause(item)}
        style={{
          flex: 1,
          marginRight: 0,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            marginVertical: 10,
          }}>
          {item?.title}
        </Text>
      </Pressable>
      {isShowAdd && (
        <Pressable
          onPress={() => onPressAdd(item?.id)}
          style={{
            marginHorizontal: 10,
          }}>
          <Image
            source={require('../../assest/images/add.png')}
            style={styles.playButton}
          />
        </Pressable>
      )}
      {isShowLike && (
        <Pressable
          onPress={() => onPressLike(item?.id)}
          style={{
            marginLeft: 10,
          }}>
          <Image
            source={
              item?.isLiked
                ? require('../../assest/images/heart.png')
                : require('../../assest/images/love.png')
            }
            style={styles.playButton}
          />
        </Pressable>
      )}

      {/* <Pressable onPress={() => playPause(item)}>
        <Image
          source={
            item?.isPlaying
              ? require('../../assest/images/video-pause-button.png')
              : require('../../assest/images/play-button.png')
          }
          style={styles.playButton}
          tintColor={'#000'}
        />
      </Pressable> */}
    </View>
  );
};

export default SongList;

const styles = StyleSheet.create({
  playButton: {
    height: 30,
    width: 30,
  },
});
