import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/header';
import {useNavigation} from '@react-navigation/native';
import InputBox from '../components/inputBox';
import Button from '../components/button';
import {createPlaylist} from '../utils/CreatePlaylist';
import {getUserPlaylists} from '../utils/GetUserPlaylists';
import {getPlaylistsWithSong} from '../utils/GetPlaylistsWithSong';
import SongList from '../components/songList';
import SoundPlayer from 'react-native-sound-player';
import BottomPlayr from '../components/bottomPlayer';
import {usePlayer} from '../context/playerContext';
import {getLikedTracks} from '../utils/GetLikedTracks';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const PlaylistScreen = () => {
  const {currentTrack, isPlaying, playTrack, togglePlayPause} = usePlayer();

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenFav, setIsOpenFav] = useState(false);
  const [favourite, setFavourite] = useState({});

  useEffect(() => {
    getFavouriteSong();
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    setLoading(true);
    const result = await getPlaylistsWithSong();
    if (result.success) {
      const data = result?.data;
      if (data?.length) {
        const temp = data?.map(val => {
          val.isOpen = false;
          return val;
        });
        setList([...temp]);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getFavouriteSong = async () => {
    setLoading(true);
    const {success, tracks} = await getLikedTracks();
    if (success) {
      const data = {
        id: 'abc123',
        name: 'Favourite',
        created_at: '',
        playlist_tracks: [],
        tracks: Array.isArray(tracks) ? [...tracks] : [],
        isOpen: false,
      };
      setFavourite(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!playlistName) {
      return;
    }
    setLoading(false);
    const data = await createPlaylist(playlistName);
    if (data.success) {
      fetchPlaylist();
    } else {
      Alert.alert('error');
      setLoading(false);
    }
    setModalVisible(false);
  };

  const onPressPlaylist = id => {
    if (id === 'abc123') {
      setFavourite(prev => ({...prev, isOpen: !prev.isOpen}));
      setList(prev =>
        prev.map(val => ({
          ...val,
          isOpen: false,
        })),
      ); // Close all other playlists
    } else {
      setList(prev =>
        prev.map(val => ({
          ...val,
          isOpen: val.id === id ? true : false,
        })),
      );
      setFavourite(prev => ({...prev, isOpen: false})); // Close favourite if another playlist is opened
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <Pressable
          onPress={() => onPressPlaylist(item?.id)}
          style={{
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {item?.name}
          </Text>
        </Pressable>
        <View>
          {item?.isOpen && (
            <FlatList
              data={[...item?.tracks]}
              renderItem={({item: items, index}) => (
                <SongList
                  isShowAdd={false}
                  isShowLike={false}
                  item={items}
                  playPause={val => playTrack(val)}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header
        lable="My Playlist"
        isShowBack
        isShowRighIcon={false}
        onPressBack={() => navigation.goBack()}
      />
      <Pressable
        style={{
          marginVertical: 10,
        }}
        onPress={() => setModalVisible(true)}>
        <Text
          style={{
            fontSize: 20,
          }}>
          + Create Playlist
        </Text>
      </Pressable>
      {renderItem({item: favourite})}
      <FlatList
        data={[...list]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
      {currentTrack?.audio_url && (
        <BottomPlayr
          isSongPlay={isPlaying}
          playPause={togglePlayPause}
          trackName={currentTrack?.title}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <InputBox
              placeholder="Enter Name"
              onChangeText={setPlaylistName}
              lable="Playlist Name"
            />
            <Button lable="Create" onPressButton={handleCreate} />
          </View>
        </View>
      </Modal>
      {loading && (
        <ActivityIndicator
          color={'#000'}
          size={40}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: 100,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: statusBarHeight,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    marginHorizontal: 20,
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
});
