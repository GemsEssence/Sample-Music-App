// supabase/functions/upload-track/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('MY_SUPABASE_URL')!,
    Deno.env.get('MY_SUPABASE_ANON_KEY')!,    
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const {
    title,
    artist,
    genre,
    audio_url,
    cover_url,
  } = await req.json();

  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { error } = await supabaseClient.from('tracks').insert([
    {
      title,
      artist,
      genre,
      audio_url,
      cover_url,
      uploaded_by: user.id,
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
});
