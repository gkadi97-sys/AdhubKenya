import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MPESA_CREDENTIALS = {
  consumerKey: Deno.env.get('MPESA_CONSUMER_KEY') || 'dummy_key',
  consumerSecret: Deno.env.get('MPESA_CONSUMER_SECRET') || 'dummy_secret',
  passKey: Deno.env.get('MPESA_PASSKEY') || 'dummy_passkey',
  shortCode: Deno.env.get('MPESA_SHORTCODE') || '174379',
  callbackUrl: Deno.env.get('MPESA_CALLBACK_URL') || `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`
};

async function generateAccessToken() {
  const credentials = btoa(`${MPESA_CREDENTIALS.consumerKey}:${MPESA_CREDENTIALS.consumerSecret}`);
  try {
    const res = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${credentials}` }
    });
    const data = await res.json();
    return data.access_token;
  } catch(e) {
    console.error('Failed token', e);
    throw new Error('Failed to generate M-Pesa token');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, phone, reference, description, userId, listingId } = await req.json();

    if (!amount || !phone || !userId || !listingId) {
      return new Response(JSON.stringify({ error: "Amount, phone, userId, and listingId are required" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Format phone number to 254...
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    }

    const token = await generateAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(MPESA_CREDENTIALS.shortCode + MPESA_CREDENTIALS.passKey + timestamp);
    
    // Call Daraja STK Push API
    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_CREDENTIALS.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: MPESA_CREDENTIALS.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: MPESA_CREDENTIALS.callbackUrl,
        AccountReference: reference || "AdHubKenya",
        TransactionDesc: description || "Payment"
      })
    });
    const result = await response.json();

    if (result.ResponseCode === "0") {
      // Store pending transaction in DB
      const { error: insertError } = await supabaseAdmin.from('transactions').insert({
         user_id: userId,
         listing_id: listingId,
         amount: amount,
         payment_method: 'mpesa',
         payment_reference: result.CheckoutRequestID,
         status: 'pending'
      });
      if (insertError) throw insertError;
    } else {
      throw new Error(result.errorMessage || result.ResponseDescription || 'Failed to initiate M-Pesa push');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('STK Push Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
