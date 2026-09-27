const express = require('express');
const router = express.Router();
const { createPurchase, listPurchases, updatePurchase } = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createPurchase); // Anyone logged in can buy
router.get('/', listPurchases);   // Own purchases if customer, all if admin
router.put('/:id', authorize('admin'), updatePurchase); // Admin updates status

module.exports = router;
