const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');
const { nextPurchaseNo } = require('../utils/counter');
const { notifyUsers } = require('../utils/push');

// @desc  Customer submits a purchase request from the Buy form
// @route POST /api/purchases
// @access Private (customer)
const createPurchase = asyncHandler(async (req, res) => {
  const { productId, name, phone, address, note = '' } = req.body;
  if (!productId || !name || !phone || !address) {
    res.status(400);
    throw new Error('productId, name, phone and address are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const purchase = await Purchase.create({
    purchaseNo: await nextPurchaseNo(),
    customer: req.user._id,
    product: product._id,
    productTitle: product.title,
    price: product.price,
    name,
    phone,
    address,
    note,
    status: 'new',
  });

  const admins = await User.find({ role: 'admin' });
  await notifyUsers(admins, {
    title: 'New product purchase request',
    body: `${purchase.purchaseNo} - ${product.title} for ${name}`,
    type: 'general',
  });

  res.status(201).json({
    success: true,
    purchase,
    message: 'Your request has been received. Our representative will be with you shortly.',
  });
});

// @desc  List purchase requests (admin = all, customer = own)
// @route GET /api/purchases?status=
// @access Private
const listPurchases = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'customer') filter.customer = req.user._id;
  if (req.query.status) filter.status = req.query.status;

  const purchases = await Purchase.find(filter)
    .populate('customer', 'name email phone company')
    .populate('product', 'title category price imageKey')
    .sort({ createdAt: -1 })
    .limit(500);

  res.json({ success: true, count: purchases.length, purchases });
});

// @desc  Admin updates a purchase request status
// @route PATCH /api/purchases/:id
// @access Private (admin)
const updatePurchase = asyncHandler(async (req, res) => {
  const { status, assignedTo, note } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (assignedTo) updates.assignedTo = assignedTo;
  if (note !== undefined) updates.note = note;

  const purchase = await Purchase.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!purchase) {
    res.status(404);
    throw new Error('Purchase request not found');
  }
  res.json({ success: true, purchase });
});

module.exports = { createPurchase, listPurchases, updatePurchase };
