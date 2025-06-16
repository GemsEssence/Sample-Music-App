// UploadTrack.ts
import { Alert, Platform } from 'react-native';
import { pick } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { SUPABASE_URL } from '@env';


export const callUploadTrack = async () => {
  try {
    // 1. Pick audio file
    const [file] = await pick({
      type: 'audio/*',
      mode: 'import',
    });

    if (!file) throw new Error('No file selected');

    const fileExt = file.name?.split('.').pop() || 'mp3';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `audio/${fileName}`;

    const localUri =
      Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;

    const base64Data = await RNFS.readFile(localUri, 'base64');
    const fileBuffer = Buffer.from(base64Data, 'base64');


    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('music')
      .upload(filePath, fileBuffer, {
        contentType: file.type || 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 3. Get public URL
    const { data: urlData } = supabase.storage
      .from('music')
      .getPublicUrl(filePath);

    const audioUrl = urlData?.publicUrl;
    if (!audioUrl) throw new Error('Failed to get public URL');

    // 4. Get session token
    const session = await supabase.auth.getSession();
    const accessToken = session.data?.session?.access_token;
    if (!accessToken) throw new Error('User not authenticated');

    // 5. Call Supabase Edge Function
    const response = await fetch(`${SUPABASE_URL}/upload-track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: file.name,
        artist: 'Unknown Artist',
        genre: 'Uncategorized',
        audio_url: audioUrl,
        cover_url: '',
      }),
    });

    const result = await response.json();
    Alert.alert(result?.success ? 'Upload complete' : 'Upload fail')
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
};
