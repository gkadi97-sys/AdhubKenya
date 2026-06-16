const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// GET /api/listings — browse with search & filter
router.get('/', async (req, res) => {
  try {
    const { keyword, category, location, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { make: { $regex: keyword, $options: 'i' } },
        { model: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const skip = (page - 1) * limit;
    const [listings, total] = await Promise.all([
      Listing.find(query).sort(sortOption).skip(skip).limit(Number(limit)).populate('seller', 'name location'),
      Listing.countDocuments(query)
    ]);
    res.json({ listings, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/featured
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' }).sort({ createdAt: -1 }).limit(12).populate('seller', 'name');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email phone whatsapp location createdAt');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.views += 1;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/listings — create listing (protected)
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, price, negotiable, category, location, condition, phone, whatsapp, make, model, year, specs: specsRaw } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    let specs = {};
    try { specs = specsRaw ? JSON.parse(specsRaw) : {}; } catch(e) { specs = {}; }
    const listing = await Listing.create({
      title, description, price: Number(price), negotiable: negotiable === 'true',
      category, location, condition, images, phone, whatsapp,
      make: make || '', model: model || '', year: year ? Number(year) : null, specs,
      seller: req.user._id
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/listings/:id — update listing (protected, owner only)
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const { title, description, price, negotiable, category, location, condition, phone, whatsapp, status, make, model, year, specs: specsRaw } = req.body;
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : listing.images;
    let specs = listing.specs || {};
    try { if (specsRaw) specs = JSON.parse(specsRaw); } catch(e) {}
    Object.assign(listing, { title, description, price: Number(price), negotiable: negotiable === 'true',
      category, location, condition, phone, whatsapp, status,
      make: make || listing.make, model: model || listing.model,
      year: year ? Number(year) : listing.year, specs,
      images: newImages.length ? newImages : listing.images });
    listing.markModified('specs');

    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/listings/:id (protected, owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/seller/:sellerId
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.params.sellerId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
