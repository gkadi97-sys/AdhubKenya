import { useState, useEffect } from 'react';
import { getCategoryMetadata } from './api';

// Global memory cache so cards don't trigger refetches
const metadataCache = {};
const pendingRequests = {};

export function useMetadataCache(categorySlug) {
  const [metadata, setMetadata] = useState(metadataCache[categorySlug] || null);

  useEffect(() => {
    if (!categorySlug) return;
    if (metadataCache[categorySlug]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
      setMetadata(metadataCache[categorySlug]);
      return;
    }

    if (!pendingRequests[categorySlug]) {
      pendingRequests[categorySlug] = getCategoryMetadata(categorySlug).then(data => {
        metadataCache[categorySlug] = data;
        return data;
      });
    }

    let isMounted = true;
    pendingRequests[categorySlug].then(data => {
      if (isMounted) setMetadata(data);
    });

    return () => { isMounted = false; };
  }, [categorySlug]);

  return metadata;
}
