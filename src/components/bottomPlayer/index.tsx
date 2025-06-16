import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface props {
  playPause: () => void;
  trackName: string;
  isSongPlay: boolean;
}

const BottomPlayr: React.FC<props> = ({
  playPause,
  trackName='Play a song..',
  isSongPlay = false,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#000',
      }}>
      <Text
        style={{
          color: '#000',
          fontSize: 20,
          flex:1
        }}
        numberOfLines={1}>
        {trackName}
      </Text>
      <Pressable onPress={() => playPause()}>
        <Image
          source={
            isSongPlay
              ? require('../../assest/images/video-pause-button.png')
              : require('../../assest/images/play-button.png')
          }
          style={styles.playButton}
          tintColor={'#000'}
        />
      </Pressable>
    </View>
  );
};

export default BottomPlayr;

const styles = StyleSheet.create({
  playButton: {
    height: 35,
    width: 35,
  },
});
