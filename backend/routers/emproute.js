const express = require('express');
const router = express.Router();

const empController = require('../controllers/empcontroller');

const upload= require('../middlewares/upload')
const { identifier, authorize  } = require('../middlewares/identification')


//For Admin Use
router.post('/create', upload.single('image'), empController.createEmployee);
router.get('/get-all', identifier, authorize('admin'), empController.getAllEmployees);
router.get('/get/:id', identifier, empController.getEmpById);
router.put('/update/:id', upload.single('image'), identifier, authorize('admin'), empController.updateEmployee);
router.delete('/delete/:id', identifier, authorize('admin'), empController.deleteEmployee);

//For employee USE
router.get('/detail', identifier, empController.getEmployee);
router.put('/update-me/:id', identifier, upload.single('image'), empController.UpdateMe);


module.exports = router;