import { supabase } from "../../lib/supabase";

export const getUserPlaylists = async () => {
    try {
        const user = await supabase.auth.getUser();
        const userId = user.data?.user?.id;

        if (!userId) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('playlists')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, data: null, error };
        }

        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error };
    }
};
