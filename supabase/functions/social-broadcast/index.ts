import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Telegram Config
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") // e.g. @AdHubKenya

// Facebook Config
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID")
const FACEBOOK_PAGE_ACCESS_TOKEN = Deno.env.get("FACEBOOK_PAGE_ACCESS_TOKEN")

// Twitter Config (OAuth 2.0 Bearer Token or OAuth 1.0a)
// For simple auto-posting via v2 API, we typically need OAuth 1.0a User Context 
// or an OAuth 2.0 Access Token with offline_access.
// Below assumes a simplified OAuth 2.0 or bearer setup if using API v2 /tweets endpoint.
// For production, you might need a library to sign OAuth 1.0a headers, but we'll outline the structure here.
const TWITTER_BEARER_TOKEN = Deno.env.get("TWITTER_BEARER_TOKEN")

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record

    // Only broadcast active listings
    if (record.status !== 'active') {
      return new Response("Not active, skipping", { status: 200 })
    }

    const priceText = record.price > 0 ? `KSh ${record.price.toLocaleString()}` : 'Price Negotiable'
    const link = `https://adhubkenya.co.ke/listing/${record.category}/${record.id}`
    const message = `🚨 New on AdHub Kenya! 🚨\n\n📦 ${record.title}\n💰 ${priceText}\n📍 ${record.location}\n\n👉 Check it out here: ${link}\n\n#AdHubKenya #${record.category.replace(/-/g, '')}`

    const results = { telegram: 'skipped', facebook: 'skipped', twitter: 'skipped' };

    // 1. Broadcast to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramApi = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
      const tgRes = await fetch(telegramApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      })
      results.telegram = tgRes.ok ? 'success' : 'failed'
    }

    // 2. Broadcast to Facebook Page
    if (FACEBOOK_PAGE_ID && FACEBOOK_PAGE_ACCESS_TOKEN) {
      const fbApi = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`
      const fbRes = await fetch(fbApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          link: link,
          access_token: FACEBOOK_PAGE_ACCESS_TOKEN
        }),
      })
      results.facebook = fbRes.ok ? 'success' : 'failed'
    }

    // 3. Broadcast to Twitter (X)
    // Note: Twitter API v2 POST /2/tweets requires OAuth 1.0a or OAuth 2.0 User context.
    // If using a 3rd-party service or simplified bearer token, it looks like this:
    if (TWITTER_BEARER_TOKEN) {
      const twitterApi = `https://api.twitter.com/2/tweets`
      const twRes = await fetch(twitterApi, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
        },
        body: JSON.stringify({ text: message }),
      })
      results.twitter = twRes.ok ? 'success' : 'failed'
    }

    return new Response(JSON.stringify({ status: "Broadcasts processed", results }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
