const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @desc  List services
// @route GET /api/services
// @access Private
const listServices = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const filter = { isActive: true };
  if (search) filter.name = new RegExp(search, 'i');

  const services = await Service.find(filter).sort({ sortOrder: 1, name: 1 });
  res.json({ success: true, count: services.length, services });
});

// @desc  Create service
// @route POST /api/services
// @access Private (admin)
const createService = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('name is required');
  }
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, service });
});

// @desc  Update service
// @route PATCH /api/services/:id
// @access Private (admin)
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, service });
});

// @desc  Delete service (soft delete by deactivating)
// @route DELETE /api/services/:id
// @access Private (admin)
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, message: 'Service deactivated' });
});

module.exports = { listServices, createService, updateService, deleteService };
