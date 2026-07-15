import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { subscribeSEO } from '@/lib/seoStore';

/**
 * GlobalSEO is a thin renderer.
 * It consumes the output of SEOEngine and SchemaFactory via seoStore.
 * It contains NO business logic for generating titles or urls.
 */
export default function GlobalSEO() {
  const [seoConfig, setSeoConfig] = useState(null);

  useEffect(() => {
    return subscribeSEO(setSeoConfig);
  }, []);

  if (!seoConfig) return null;

  const {
    title,
    description,
    canonical,
    noindex,
    openGraph,
    twitter,
    schema = []
  } = seoConfig;

  const BASE_URL = 'https://adhubkenya.co.ke';
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      {title && <title>{title}</title>}
      {title && <meta name="title" content={title} />}
      {description && <meta name="description" content={description} />}

      {/* Robots Directives */}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      {openGraph && (
        <>
          {openGraph.type && <meta property="og:type" content={openGraph.type} />}
          {openGraph.url && <meta property="og:url" content={openGraph.url} />}
          {openGraph.title && <meta property="og:title" content={openGraph.title} />}
          {openGraph.description && <meta property="og:description" content={openGraph.description} />}
          {openGraph.image && <meta property="og:image" content={openGraph.image} />}
          <meta property="og:locale" content="en_KE" />
          <meta property="og:site_name" content="AdHub Kenya" />
        </>
      )}

      {/* Twitter Cards */}
      {twitter && (
        <>
          {twitter.card && <meta name="twitter:card" content={twitter.card} />}
          {twitter.site && <meta name="twitter:site" content={twitter.site} />}
          {twitter.title && <meta name="twitter:title" content={twitter.title} />}
          {twitter.description && <meta name="twitter:description" content={twitter.description} />}
          {twitter.image && <meta name="twitter:image" content={twitter.image} />}
        </>
      )}

      {/* Structured Data (JSON-LD) */}
      {schema && schema.length > 0 && schema.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
