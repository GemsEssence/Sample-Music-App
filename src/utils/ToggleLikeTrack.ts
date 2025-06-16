import { supabase } from "../../lib/supabase";

export const toggleLikeTrack = async (trackId: string) => {
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('track_id', trackId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
    if (error) throw error;
    return { trackId, liked: false };
  } else {
    const { error } = await supabase.from('likes').insert([
      { user_id: userId, track_id: trackId },
    ]);
    if (error) throw error;
    return { trackId, liked: true };
  }
};
