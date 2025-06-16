
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const SUPABASE_URL = Deno.env.get('MY_SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY');

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ error: 'Email and OTP are requireddd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get latest OTP for this email
    const { data, error } = await supabase
      .from('otp_requests')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid OTP' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Optional: Check if OTP is older than 5 minutes
    const createdAt = new Date(data[0].created_at);
    const now = new Date();
    const minutesDiff = (now.getTime() - createdAt.getTime()) / 60000;
    if (minutesDiff > 5) {
      return new Response(JSON.stringify({ success: false, message: 'OTP expired' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Optional: Delete OTP after verification (1-time use)
    await supabase
      .from('otp_requests')
      .delete()
      .eq('id', data[0].id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('verify-otp error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
