import { supabase } from "../../lib/supabase";

export const getLikedTracks = async () => {
  try {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data?.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('likes')
      .select(`
        id,
        track:track_id (
          *
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Extract only tracks from the joined data
    const likedTracks = data.map(item => ({
      ...item.track,
      isLiked: true,
    }));
    return { success: true, tracks: likedTracks };
  } catch (error) {
    console.error('Failed to fetch liked tracks:', error);
    return { success: false, error };
  }
};
