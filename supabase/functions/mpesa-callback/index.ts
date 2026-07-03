import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const stkCallback = body.Body?.stkCallback;

    if (!stkCallback) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    // const resultDesc = stkCallback.ResultDesc;

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (resultCode === 0) {
      // Success
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const receiptItem = callbackMetadata.find((i: any) => i.Name === 'MpesaReceiptNumber');
      const amountItem = callbackMetadata.find((i: any) => i.Name === 'Amount');
      
      const receiptNumber = receiptItem ? receiptItem.Value : null;
      const amount = amountItem ? amountItem.Value : 0;

      // Update transaction
      const { data: tx, error: txError } = await supabaseAdmin
        .from('transactions')
        .update({ 
          status: 'completed', 
          receipt_number: receiptNumber,
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', checkoutRequestID)
        .select()
        .single();

      if (txError) throw txError;

      // Promote listing
      if (tx && tx.listing_id) {
        // Calculate days based on amount (500=7, 800=14, 1500=30)
        let days = 7;
        if (amount >= 1500) days = 30;
        else if (amount >= 800) days = 14;

        const promotedUntil = new Date();
        promotedUntil.setDate(promotedUntil.getDate() + days);

        await supabaseAdmin
          .from('listings')
          .update({ 
            promoted_until: promotedUntil.toISOString(),
            status: 'active' // Ensure it's active
          })
          .eq('id', tx.listing_id);
      }
      
    } else {
      // Failed or Cancelled
      await supabaseAdmin
        .from('transactions')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', checkoutRequestID);
    }

    // Safaricom expects a success response acknowledging receipt
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Callback Error:', error);
    // Still return 200 so Safaricom doesn't retry endlessly if it's our internal error
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted but failed internally" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
