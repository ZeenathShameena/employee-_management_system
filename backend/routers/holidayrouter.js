const express = require('express');
const router = express.Router();
const { identifier, authorize  } = require('../middlewares/identification')

const HolidayController = require('../controllers/holidaycontroller');



router.post('/add', identifier, authorize('admin'), HolidayController.addHoliday);
router.get('/get-all', identifier, HolidayController.getUpcomingHolidays);

module.exports = router;