import { supabase } from "../../lib/supabase";


export const createPlaylist = async (name: string) => {
    try {
        const user = await supabase.auth.getUser();
        const userId = user.data?.user?.id;

        if (!userId) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('playlists')
            .insert([{ name, user_id: userId }])
            .select()
            .single();

        if (error) {
            return { success: false, data: null, error };
        }

        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error };
    }
};
