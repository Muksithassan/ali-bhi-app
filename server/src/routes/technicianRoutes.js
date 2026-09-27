const express = require('express');
const router = express.Router();
const {
  listTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  technicianProfile,
} = require('../controllers/technicianController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Tech can see their own profile
router.get('/profile', authorize('technician', 'admin'), technicianProfile);

// Admin only routes
router.use(authorize('admin'));
router.get('/', listTechnicians);
router.post('/', createTechnician);
router.put('/:id', updateTechnician);
router.delete('/:id', deleteTechnician);

module.exports = router;
