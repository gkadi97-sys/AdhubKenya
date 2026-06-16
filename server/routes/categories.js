const express = require('express');
const router = express.Router();

const categories = [
  { slug: 'electronics', name: 'Electronics', icon: '📱', description: 'Phones, laptops, TVs, cameras & more' },
  { slug: 'vehicles', name: 'Vehicles', icon: '🚗', description: 'Cars, motorcycles, trucks & spare parts' },
  { slug: 'property', name: 'Property', icon: '🏠', description: 'Houses, apartments, land & rentals' },
  { slug: 'fashion', name: 'Fashion & Beauty', icon: '👗', description: 'Clothes, shoes, accessories & beauty' },
  { slug: 'services', name: 'Services', icon: '🔧', description: 'Plumbing, cleaning, tutoring & more' },
  { slug: 'jobs', name: 'Jobs', icon: '💼', description: 'Full-time, part-time & freelance jobs' },
  { slug: 'agriculture', name: 'Agriculture', icon: '🌱', description: 'Farm produce, livestock & equipment' },
  { slug: 'furniture', name: 'Furniture & Home', icon: '🛋️', description: 'Sofas, beds, appliances & decor' },
  { slug: 'sports', name: 'Sports & Outdoors', icon: '⚽', description: 'Gym equipment, bicycles & outdoor gear' },
  { slug: 'kids', name: 'Kids & Baby', icon: '👶', description: 'Toys, clothing, strollers & baby gear' },
  { slug: 'food', name: 'Food & Catering', icon: '🍽️', description: 'Catering services & food businesses' },
  { slug: 'health', name: 'Health & Beauty', icon: '💊', description: 'Medical equipment, wellness & beauty products' }
];

router.get('/', (req, res) => res.json(categories));
router.get('/:slug', (req, res) => {
  const cat = categories.find(c => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

module.exports = router;
