'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOP_CATEGORIES } from '@/lib/categoryData';

export default function HomeSearchBar() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (category) params.set('category', category);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c8065" strokeWidth="2" style={{flexShrink:0}}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text" placeholder="What are you looking for?"
        value={search} onChange={e => setSearch(e.target.value)}
      />
      <select
        value={category} onChange={e => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {TOP_CATEGORIES && TOP_CATEGORIES.map(c => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
