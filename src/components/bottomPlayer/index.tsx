import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface Props {
  playPause: () => void;
  trackName?: string;
  isSongPlay?: boolean;
}

const BottomPlayer: React.FC<Props> = ({
  playPause,
  trackName = 'Play a song...',
  isSongPlay = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.trackName} numberOfLines={1}>
        {trackName}
      </Text>
      <Pressable onPress={playPause}>
        <Image
          source={
            isSongPlay
              ? require('../../assest/images/video-pause-button.png')
              : require('../../assest/images/play-button.png')
          }
          style={styles.playButton}
          tintColor="#000"
        />
      </Pressable>
    </View>
  );
};

export default BottomPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  trackName: {
    color: '#000',
    fontSize: 20,
    flex: 1,
    marginRight: 10,
  },
  playButton: {
    height: 35,
    width: 35,
  },
});
