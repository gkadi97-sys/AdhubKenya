import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const category  = searchParams.get('category')  || '';
  const location  = searchParams.get('location')  || '';
  const keyword   = searchParams.get('keyword')   || '';
  const make      = searchParams.get('make')      || '';
  const minPrice  = searchParams.get('minPrice')  || '';
  const maxPrice  = searchParams.get('maxPrice')  || '';
  const sort      = searchParams.get('sort')      || 'createdAt';
  const page      = parseInt(searchParams.get('page')  || '1');
  const limit     = parseInt(searchParams.get('limit') || '12');

  let query = supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(name, location, created_at)', { count: 'exact' })
    .eq('status', 'active');

  if (category) query = query.eq('category', category);
  if (location) query = query.ilike('location', `%${location}%`);
  if (make)     query = query.ilike('make', make);          // ← exact make filter
  if (keyword)  query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);

  if (sort === 'price_asc')  query = query.order('price', { ascending: true });
  else if (sort === 'price_desc') query = query.order('price', { ascending: false });
  else                        query = query.order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const to   = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    listings: data,
    total: count,
    pages: Math.ceil(count / limit),
  });
}
