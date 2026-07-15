import { useParams } from 'react-router-dom';
import Listing from './Listing';
import Browse from './Browse';

export default function ListingOrBrowse() {
  const { category, slugId } = useParams();

  // Check if the slug ends with a valid UUID
  const uuidMatch = slugId?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  if (uuidMatch) {
    // If it has a UUID, it's a listing details page
    return <Listing />;
  }

  // Otherwise, it's a brand landing page (e.g. /phones-tablets/samsung)
  return <Browse defaultCategory={category} defaultBrand={slugId} />;
}
