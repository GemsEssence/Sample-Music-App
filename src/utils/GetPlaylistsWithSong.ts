import { supabase } from "../../lib/supabase";

export const getPlaylistsWithSong = async () => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_tracks (
          *,
          track:track_id (
            *
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, data: null, error };
    }

    // Flatten the nested track info (optional)
    const playlists = data.map((playlist) => ({
      ...playlist,
      tracks: playlist.playlist_tracks.map((pt: any) => pt.track),
    }));

    return { success: true, data: playlists, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
