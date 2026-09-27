const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Browse products
// @route GET /api/products?search=&category=&newArrivals=true
// @access Private
const listProducts = asyncHandler(async (req, res) => {
  const { search = '', category, newArrivals } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (newArrivals === 'true') filter.isNewArrival = true;
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});

// @desc  Single product
// @route GET /api/products/:id
// @access Private
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc  Create product
// @route POST /api/products
// @access Private (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { title, price } = req.body;
  if (!title || price === undefined) {
    res.status(400);
    throw new Error('title and price are required');
  }
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc  Update product
// @route PATCH /api/products/:id
// @access Private (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc  Delete product
// @route DELETE /api/products/:id
// @access Private (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
