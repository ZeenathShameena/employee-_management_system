const express = require('express');
const router = express.Router();
const { identifier, authorize  } = require('../middlewares/identification')

const deptController = require('../controllers/deptcontroller');



router.post('/create', identifier, authorize('admin'), deptController.createDepartment);
router.get('/get-all', identifier, authorize('admin'), deptController.getDepartments);
router.get('/employees-list/:deptName', identifier, authorize('admin'), deptController.getEmployeesByDeptName);
router.delete('/delete/:id', identifier, authorize('admin'), deptController.deleteDepartment);
router.put('/update/:id', identifier, authorize('admin'), deptController.updateDepartment);


module.exports = router;