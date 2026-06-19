import Link from 'next/link';
import { getFeaturedListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CategoryGrid from '@/components/CategoryGrid';
import HomeSearchBar from '@/components/HomeSearchBar';

export const metadata = {
  title: "Buy & Sell Online in Kenya | Free Classified Ads | AdHubKenya",
  description: "Kenya's #1 marketplace to buy and sell electronics, cars, property, and fashion. Post free classified ads and connect with local buyers today. Start selling!",
  alternates: {
    canonical: "https://adhubkenya.co.ke",
  },
  openGraph: {
    title: "AdHubKenya: Buy & Sell Anything in Kenya",
    description: "Join thousands of Kenyans buying and selling on AdHubKenya.",
    url: "https://adhubkenya.co.ke",
    siteName: "AdHubKenya",
    type: "website",
  }
};

export default async function HomePage() {
  let listings = [];
  try {
    listings = await getFeaturedListings();
  } catch (err) {
    console.error("Error fetching featured listings", err);
  }

  const counties = ['Nairobi','Mombasa','Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Garissa','Wajir','Mandera','Marsabit','Isiolo','Meru','Tharaka-Nithi','Embu','Kitui','Machakos','Makueni','Nyandarua','Nyeri','Kirinyaga',"Murang'a",'Kiambu','Turkana','West Pokot','Samburu','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia','Nakuru','Narok','Kajiado','Kericho','Bomet','Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisumu','Homa Bay','Migori','Kisii','Nyamira'];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://adhubkenya.co.ke/#website",
        "url": "https://adhubkenya.co.ke/",
        "name": "AdHubKenya",
        "description": "Buy & Sell Online in Kenya | Free Classified Ads",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://adhubkenya.co.ke/browse?keyword={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://adhubkenya.co.ke/#organization",
        "name": "AdHubKenya",
        "url": "https://adhubkenya.co.ke/",
        "logo": "https://adhubkenya.co.ke/logo.png",
        "sameAs": [
          "https://www.facebook.com/adhubkenya",
          "https://twitter.com/adhubkenya"
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--primary-glow)',border:'1px solid var(--primary)',borderRadius:'var(--radius-full)',padding:'6px 16px',fontSize:'0.8rem',color:'var(--primary-light)',marginBottom:20,fontWeight:600}}>
              🇰🇪 Kenya's #1 Classified Ads Platform
            </div>
            <h1 style={{fontSize:'3rem', marginBottom:16}}>
              Buy & Sell Anything Online<br/>
              <span className="text-gradient">in Kenya</span>
            </h1>
            <p>Join over 50,000 Kenyans on the fastest growing online marketplace. Whether you are looking for affordable cars in Nairobi, cheap apartments in Mombasa, or the latest electronics, AdHubKenya connects you directly with verified sellers. Post your classified ad for free.</p>

            <HomeSearchBar />

            {/* Quick county links */}
            <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:20}}>
              {counties.slice(0, 10).map(c => (
                <Link key={c} href={`/browse?location=${c}`} title={`Classifieds in ${c}`}
                  style={{fontSize:'0.8rem',color:'var(--text-muted)',padding:'4px 12px',borderRadius:'var(--radius-full)',border:'1px solid var(--border)',background:'var(--surface)',transition:'var(--transition)'}}
                >
                  {c}
                </Link>
              ))}
              <Link href="/browse" title="All locations in Kenya" style={{fontSize:'0.8rem',color:'var(--primary-light)',padding:'4px 12px',borderRadius:'var(--radius-full)',border:'1px solid var(--primary)',background:'var(--primary-glow)',transition:'var(--transition)'}}>+ More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'20px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,textAlign:'center'}}>
            {[['10,000+','Active Listings'],['50,000+','Happy Users'],['47','Counties Covered'],['Free','To Post Ads']].map(([val,lbl]) => (
              <div key={lbl}>
                <div style={{fontSize:'1.6rem',fontWeight:800,fontFamily:'var(--font-display)',color:'var(--primary-light)'}}>{val}</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:2}}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <h2 style={{fontSize:'1.5rem'}}>Browse Top Classified Categories in Kenya</h2>
              <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:'0.9rem'}}>Find exactly what you're looking for</p>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="section" style={{paddingTop:0}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <h2 style={{fontSize:'1.5rem'}}>Latest Classified Ads Near You</h2>
              <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:'0.9rem'}}>Fresh ads posted by sellers near you</p>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">See all →</Link>
          </div>

          {listings && listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🏪</div>
              <h3>No listings yet</h3>
              <p>Be the first to post an ad on AdHub Kenya!</p>
              <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{background:'linear-gradient(135deg, var(--bg-3), #0d2215)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'64px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontSize:'2rem',marginBottom:12}}>Start Selling in Kenya Today</h2>
          <p style={{color:'var(--text-secondary)',marginBottom:28,maxWidth:480,margin:'0 auto 28px'}}>Posting your first ad is completely free. Reach thousands of buyers across Kenya in minutes.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/post-ad" className="btn btn-accent btn-lg">Post Free Ad Now</Link>
            <Link href="/browse" className="btn btn-outline btn-lg">Browse Listings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
