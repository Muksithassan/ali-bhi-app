const express = require('express');
const router = express.Router();
const { listServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', listServices);

router.use(protect);
router.use(authorize('admin'));

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
