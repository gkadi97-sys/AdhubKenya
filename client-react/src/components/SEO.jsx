import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { subscribeSEO } from '@/lib/seoStore';

const SITE_NAME = 'AdHub Kenya';
const TWITTER_SITE = '@AdHubKenya';
const BASE_URL = 'https://adhubkenya.co.ke';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function GlobalSEO() {
  const [seo, setSeo] = useState({});

  useEffect(() => {
    return subscribeSEO(setSeo);
  }, []);

  const { title, description, canonicalPath, ogImage, ogType = 'website', keywords, noindex = false } = seo;

  const fullTitle = title
    ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
    : `${SITE_NAME} – Buy & Sell Anything in Kenya`;

  const fullUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      {description && <meta name="description" content={description} />}
      {keywords?.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical */}
      {fullUrl && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      {fullUrl && <meta name="twitter:url" content={fullUrl} />}
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />
    </Helmet>
  );
}
