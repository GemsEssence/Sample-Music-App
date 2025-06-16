// import { createClient } from 'npm:@supabase/supabase-js@2'
// import { createClient } from "jsr:@supabase/supabase-js@2";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('MY_SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 })
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // Save OTP to Supabase table
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    await supabase.from('otp_requests').insert({
      email,
      otp,
    })

    // Send OTP via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // from: 'Your App <laxminarayan.jatav@gemsessence.com>', // This domain must be verified in Resend
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
      }),
    })

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, otp }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
})
