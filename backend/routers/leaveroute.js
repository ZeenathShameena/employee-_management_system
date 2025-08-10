const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leavecontroller');

const { identifier, authorize } = require('../middlewares/identification')

//For Admin Use
router.get('/details', identifier, authorize('admin'), leaveController.getAll);
router.put('/update-status/:id', identifier, authorize('admin'), identifier, leaveController.updateLeaveStatus);

//For Employee Use
router.post('/apply', identifier, leaveController.applyLeave);
router.get('/history', identifier, leaveController.LeaveHistory);

module.exports = router;