import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

serve(async (req) => {
  try {
    const data = await req.json();
    console.log("M-Pesa Callback Data:", JSON.stringify(data));

    const result = data.Body.stkCallback;
    const checkoutRequestID = result.CheckoutRequestID;
    const resultCode = result.ResultCode;

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (resultCode === 0) {
      // Payment successful
      const meta = result.CallbackMetadata.Item;
      const amountItem = meta.find((i: any) => i.Name === 'Amount');
      const receiptItem = meta.find((i: any) => i.Name === 'MpesaReceiptNumber');
      const phoneItem = meta.find((i: any) => i.Name === 'PhoneNumber');

      const amount = amountItem?.Value;
      const receipt = receiptItem?.Value;
      const phone = phoneItem?.Value;

      // Update transaction status
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'completed',
          payment_reference: receipt,
          amount: amount,
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', checkoutRequestID);

      // If there's a listing_id, we might want to activate it or promote it
      const { data: tx } = await supabaseAdmin
        .from('transactions')
        .select('listing_id')
        .eq('payment_reference', receipt)
        .single();
        
      if (tx?.listing_id) {
         // E.g. make listing active, or set promoted_until
         await supabaseAdmin
           .from('listings')
           .update({ status: 'active' }) // or update promoted_until if it was a promotion
           .eq('id', tx.listing_id);
      }

    } else {
      // Payment failed or cancelled
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', checkoutRequestID);
    }

    // Acknowledge receipt to Safaricom
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Success"
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing callback:", error);
    // Even on error, we must return 200 to Safaricom to prevent retries
    return new Response(JSON.stringify({
       ResultCode: 1,
       ResultDesc: "Internal Error"
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
