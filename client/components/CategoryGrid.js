'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';

const fallbackCategories = [
  { slug:'electronics',name:'Electronics',icon:'📱' },
  { slug:'vehicles',name:'Vehicles',icon:'🚗' },
  { slug:'property',name:'Property',icon:'🏠' },
  { slug:'fashion',name:'Fashion',icon:'👗' },
  { slug:'services',name:'Services',icon:'🔧' },
  { slug:'jobs',name:'Jobs',icon:'💼' },
  { slug:'agriculture',name:'Agriculture',icon:'🌱' },
  { slug:'furniture',name:'Furniture',icon:'🛋️' },
  { slug:'sports',name:'Sports',icon:'⚽' },
  { slug:'kids',name:'Kids',icon:'👶' },
  { slug:'food',name:'Food',icon:'🍽️' },
  { slug:'health',name:'Health',icon:'💊' },
];

export default function CategoryGrid({ onSelect, selected }) {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="categories-grid">
      {categories.map(cat => (
        onSelect ? (
          <div
            key={cat.slug}
            className={`category-card ${selected === cat.slug ? 'active' : ''}`}
            style={selected === cat.slug ? { borderColor:'var(--primary)', background:'var(--primary-glow)' } : {}}
            onClick={() => onSelect(cat.slug === selected ? '' : cat.slug)}
          >
            <div className="icon">{cat.icon}</div>
            <div className="name">{cat.name}</div>
          </div>
        ) : (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className="category-card">
            <div className="icon">{cat.icon}</div>
            <div className="name">{cat.name}</div>
          </Link>
        )
      ))}
    </div>
  );
}
