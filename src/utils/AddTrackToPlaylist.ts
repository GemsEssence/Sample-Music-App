import { supabase } from "../../lib/supabase";

export const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
  try {
    const { error } = await supabase.from('playlist_tracks').insert([
      { playlist_id: playlistId, track_id: trackId },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    return { success: false, error };
  }
};
