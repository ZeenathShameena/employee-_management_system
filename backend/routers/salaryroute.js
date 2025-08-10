const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salarycontroller');

const { identifier, authorize } = require('../middlewares/identification')

//For Admin Use
router.post('/generate', identifier, authorize('admin'), salaryController.addSalary);
router.get('/all', identifier, authorize('admin'), salaryController.getAllSalary);

//For Employee Use
router.get('/show', identifier, salaryController.getMySalary);

module.exports = router;