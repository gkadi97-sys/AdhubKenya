'use client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '@/lib/api';

import { CATEGORY_ATTRIBUTES } from '@/lib/categoryData';
import { JOB_CATEGORIES } from '@/lib/jobsData';

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

function getCategoryContents(slug) {
  if (slug === 'jobs') return Object.keys(JOB_CATEGORIES || {}).slice(0, 7);
  if (CATEGORY_ATTRIBUTES[slug]?.data) {
    return Object.keys(CATEGORY_ATTRIBUTES[slug].data).slice(0, 7);
  }
  return [];
}

export default function CategoryGrid({ onSelect, selected }) {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const renderPopup = (slug) => {
    const items = getCategoryContents(slug);
    if (items.length === 0) return null;
    return (
      <div className="category-popup" onClick={e => e.stopPropagation()}>
        <div className="category-popup-title">Top in Category</div>
        {items.map(item => (
          <div key={item} className="category-popup-item">{item}</div>
        ))}
        {items.length >= 7 && <div className="category-popup-item" style={{ fontStyle: 'italic', color: 'var(--primary)' }}>View more...</div>}
      </div>
    );
  };

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
            {renderPopup(cat.slug)}
          </div>
        ) : (
          <Link key={cat.slug} to={`/category/${cat.slug}`} className="category-card">
            <div className="icon">{cat.icon}</div>
            <div className="name">{cat.name}</div>
            {renderPopup(cat.slug)}
          </Link>
        )
      ))}
    </div>
  );
}
