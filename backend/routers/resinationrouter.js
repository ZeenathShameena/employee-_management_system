const express = require('express');
const router = express.Router();
const ResignationController = require('../controllers/resignationcontroller');

const { identifier, authorize } = require('../middlewares/identification')

//For Admin Use
router.get('/get-all', identifier, authorize('admin'), ResignationController.getAllResignations);
router.put('/update-status/:id', identifier, authorize('admin'), identifier, ResignationController.respondToResignation);

//For Employee Use
router.post('/apply', identifier, ResignationController.submitResignation);
router.get('/status', identifier, ResignationController.getStatus);

module.exports = router;