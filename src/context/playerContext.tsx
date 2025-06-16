import React, {createContext, useContext, useEffect, useState} from 'react';
import SoundPlayer from 'react-native-sound-player';

const PlayerContext = createContext(null);

// Custom hook to use the player context
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const [currentTrack, setCurrentTrack] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const sub = SoundPlayer.addEventListener('FinishedPlaying', () => {
      setIsPlaying(false);
    });

    return () => {
      sub.remove();
      // SoundPlayer.stop();
    };
  }, []);

  const playTrack = (track: string) => {
    try {
      SoundPlayer.stop();
      SoundPlayer.playUrl(track?.audio_url);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to play track:', error);
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack?.audio_url) {
      return;
    }
    setIsPlaying(prev => {
      let newState = prev;
      if (prev) {
        SoundPlayer.pause();
        newState = false;
      } else {
        try {
          SoundPlayer.resume(); // resume instead of replay
          newState = true;
        } catch (error) {
          console.warn('Failed to resume track:', error);
        }
      }
      return newState;
    });
  };

  return (
    <PlayerContext.Provider
      value={{currentTrack, isPlaying, playTrack, togglePlayPause}}>
      {children}
    </PlayerContext.Provider>
  );
};
