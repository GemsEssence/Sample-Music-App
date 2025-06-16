import {supabase} from '../../lib/supabase';

export const getAllTracks = async () => {
  try {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data?.user?.id;

    if (!userId) throw new Error('User not authenticated');

    const {data, error} = await supabase
      .from('tracks')
      .select(`*,likes(id, user_id)`)
      .order('created_at', {ascending: false});

    if (error) throw error;

    // Add isLiked flag

    const tracksWithLike = data.map(track => ({
      ...track,
      isLiked: track.likes.some(like => like.user_id === userId),
    }));

    return {success: true, tracks: tracksWithLike};
  } catch (error) {
    console.error('Failed to fetch tracks:', error);
    return {success: false, error};
  }
};

