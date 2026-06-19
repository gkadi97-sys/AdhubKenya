import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

export const runtime = 'edge';

const CATEGORY_META = {
  electronics: { name:'Electronics', icon:'📱', desc:'Phones, laptops, TVs, cameras & accessories' },
  vehicles:    { name:'Vehicles',    icon:'🚗', desc:'Cars, motorcycles, trucks & spare parts' },
  property:    { name:'Property',    icon:'🏠', desc:'Houses, apartments, land & rentals' },
  fashion:     { name:'Fashion & Beauty', icon:'👗', desc:'Clothes, shoes, accessories & beauty products' },
  services:    { name:'Services',    icon:'🔧', desc:'Plumbing, cleaning, tutoring & professional services' },
  jobs:        { name:'Jobs',        icon:'💼', desc:'Full-time, part-time & freelance opportunities' },
  agriculture: { name:'Agriculture', icon:'🌱', desc:'Farm produce, livestock & farming equipment' },
  furniture:   { name:'Furniture & Home', icon:'🛋️', desc:'Sofas, beds, appliances & home decor' },
  sports:      { name:'Sports & Outdoors', icon:'⚽', desc:'Gym equipment, bicycles & outdoor gear' },
  kids:        { name:'Kids & Baby', icon:'👶', desc:'Toys, clothing, strollers & baby products' },
  food:        { name:'Food & Catering', icon:'🍽️', desc:'Catering services & food businesses' },
  health:      { name:'Health',      icon:'💊', desc:'Medical equipment, wellness & beauty' },
};

export async function generateMetadata({ params, searchParams }) {
  const { category: categoryPath } = params;
  const category = categoryPath[0] || 'all';
  const location = categoryPath.length > 1 ? categoryPath[categoryPath.length - 1] : '';
  
  const meta = CATEGORY_META[category] || { name: category, icon: '🏷️', desc: `Browse ${category} listings` };
  
  let title = `Buy & Sell ${meta.name} in Kenya | AdHubKenya`;
  let description = `Find ${meta.name} for sale in Kenya. Great prices, verified sellers. Post your ad for free today!`;
  
  if (location && location !== category) {
    title = `${meta.name} in ${location} | AdHubKenya`;
    description = `Shop for ${meta.name} in ${location}. Best deals from local sellers in Kenya.`;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adhubkenya.co.ke';
  const canonicalUrl = `${baseUrl}/${categoryPath.join('/')}`;
  const isSearch = Object.keys(searchParams || {}).length > 0;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !isSearch,
      follow: true
    }
  };
}

export default async function CategoryCatchAllPage({ params, searchParams }) {
  const { category: categoryPath } = params;
  const category = categoryPath[0];
  const location = categoryPath.length > 1 ? categoryPath[categoryPath.length - 1] : '';

  const sort = searchParams.sort || 'createdAt';
  const page = searchParams.page || 1;
  
  const meta = CATEGORY_META[category] || { name: category, icon: '🏷️', desc: `Browse ${category} listings` };
  
  // Call API from server side
  let data = { listings: [], total: 0, pages: 1 };
  try {
    data = await getListings({ category, sort, page, location: location !== category ? location : undefined });
  } catch (err) {
    console.error("Failed to fetch listings:", err);
  }
  
  const { listings, total, pages } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': listings.map((l, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `https://adhubkenya.co.ke/listing/${l._id}`
    }))
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{background:'linear-gradient(135deg, var(--bg-2), var(--bg-3))',borderBottom:'1px solid var(--border)',padding:'40px 0'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{fontSize:'3rem'}}>{meta.icon}</span>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <Link href="/" style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>Home</Link>
                <span style={{color:'var(--text-muted)'}}>›</span>
                {categoryPath.map((path, idx) => (
                  <span key={idx} style={{color: idx === categoryPath.length - 1 ? 'var(--text-secondary)' : 'var(--text-muted)',fontSize:'0.85rem'}}>
                    {idx > 0 && <span style={{margin:'0 8px'}}>›</span>}
                    {path}
                  </span>
                ))}
              </div>
              <h1 style={{fontSize:'2rem',marginBottom:4,textTransform:'capitalize'}}>
                {location && location !== category ? `${meta.name} in ${location}` : meta.name}
              </h1>
              <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>{meta.desc} — <strong style={{color:'var(--primary-light)'}}>{total.toLocaleString()} ads</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'32px 20px 80px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{total} listings</span>
          <div style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>Sorted by: {sort === 'price_asc' ? 'Lowest Price' : sort === 'price_desc' ? 'Highest Price' : 'Newest'}</div>
        </div>

        {listings.length > 0 ? (
          <>
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
            {pages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:40}}>
                {[...Array(pages)].map((_,i) => (
                  <Link key={i} href={`/${categoryPath.join('/')}?page=${i+1}&sort=${sort}`}
                    className={`btn btn-sm ${parseInt(page)===i+1?'btn-primary':'btn-ghost'}`}>
                    {i+1}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">{meta.icon}</div>
            <h3>No {meta.name} listings yet</h3>
            <p>Be the first to post in this category!</p>
            <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
          </div>
        )}
      </div>
    </div>
  );
}
