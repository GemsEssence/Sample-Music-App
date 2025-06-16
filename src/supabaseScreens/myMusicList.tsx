import {
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../utils/GetCurrentUser';
import { callUploadTrack } from '../utils/UploadTrack';
import { getAllTracks } from '../utils/GetAllTracks';
import SoundPlayer from 'react-native-sound-player';
import { toggleLikeTrack } from '../utils/ToggleLikeTrack';
import { getLikedTracks } from '../utils/GetLikedTracks';
import SongList from '../components/songList';
import { getUserPlaylists } from '../utils/GetUserPlaylists';
import { addTrackToPlaylist } from '../utils/AddTrackToPlaylist';
import BottomPlayr from '../components/bottomPlayer';
import { usePlayer } from '../context/playerContext';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const MyMusicList = () => {
  const navigation = useNavigation();
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const [user, setUser] = useState({});
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [liked, setLiked] = useState([]);
  const [list, setList] = useState([]);
  const [trackId, setTrackId] = useState('');

  useEffect(() => {
    fetchTracks();
    fetchPlaylist();
    return () => setTracks([]);
  }, []);

  const fetchPlaylist = async () => {
    setLoading(true);
    const result = await getUserPlaylists();
    if (result.success) {
      const data = result?.data;
      if (data?.length) {
        setList([...data]);
      }
    }
    setLoading(false);
  };

  const fetchTracks = async () => {
    setLoading(true);
    const result = await getAllTracks();
    if (result.success) {
      const data = result?.tracks;
      const temp = data.map(val => ({ ...val, isPlaying: false }));
      setTracks([...temp]);
    }
    setLoading(false);
  };

  const addToPlaylist = id => {
    setTrackId(id);
    setModalVisible(true);
  };

  const onPressPlaylistName = async playlistId => {
    setLoading(true);
    const { success } = await addTrackToPlaylist(playlistId, trackId);
    if (success) {
      setModalVisible(false);
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
  };

  const upload = async () => {
    setLoading(true);
    SoundPlayer.stop();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return;
    }
    const res = await callUploadTrack();
    if (res?.success) {
      fetchTracks();
    }
    setLoading(false);
  };

  const onPressLike = async trackId => {
    try {
      const { liked } = await toggleLikeTrack(trackId);
      setTracks(prev =>
        prev.map(track =>
          track.id === trackId ? { ...track, isLiked: liked } : track
        )
      );
    } catch (err) {
      console.error('Failed to like/unlike track:', err);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignInScreenSupabase' }],
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header
        lable="My Music"
        isShowBack={false}
        isShowRighIcon
        onPressRight={upload}
      />

      <FlatList
        data={tracks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <SongList
            onPressAdd={addToPlaylist}
            item={item}
            onPressLike={onPressLike}
            playPause={() => playTrack(item)}
          />
        )}
      />

      {currentTrack?.audio_url && (
        <BottomPlayr
          isSongPlay={isPlaying}
          playPause={togglePlayPause}
          trackName={currentTrack?.title}
        />
      )}

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.bottomIcons}
          onPress={() => navigation.navigate('PlaylistScreen')}>
          <Text>Playlist</Text>
        </Pressable>
        <Pressable style={styles.bottomIcons} onPress={handleLogout}>
          <Text>Logout</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={list}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onPressPlaylistName(item?.id)}
                  style={styles.playlistItem}>
                  <Text style={styles.playlistText}>{item?.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {loading && (
        <ActivityIndicator color="#000" size={40} style={styles.loader} />
      )}
    </SafeAreaView>
  );
};

export default MyMusicList;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: statusBarHeight,
    marginBottom: 20,
  },
  bottomIcons: {
    height: 50,
    width: 50,
    backgroundColor: 'tan',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playlistItem: {
    padding: 5,
    marginVertical: 10,
  },
  playlistText: {
    fontSize: 20,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: 100,
  },
});
