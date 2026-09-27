const express = require('express');
const router = express.Router();
const {
  availability,
  createBooking,
  listBookings,
  getBooking,
  confirmBooking,
  assignTechnicians,
  cancelBooking,
  startJob,
  uploadEvidence,
  completeJob,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // all booking routes require auth

router.get('/availability', availability);
router.post('/', createBooking);
router.get('/', listBookings);
router.get('/:id', getBooking);

router.put('/:id/confirm', authorize('admin'), confirmBooking);
router.put('/:id/assign', authorize('admin'), assignTechnicians);
router.put('/:id/cancel', cancelBooking); // handler should check if admin or owner

router.put('/:id/start', authorize('technician'), startJob);
router.post('/:id/evidence', authorize('technician'), uploadEvidence);
router.put('/:id/complete', authorize('technician'), completeJob);

module.exports = router;
