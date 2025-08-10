const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');

const { identifier } = require('../middlewares/identification')


router.post('/register-admin', authController.registerAdmin);
router.post('/login', authController.signin);
router.post('/logout', identifier, authController.logout);
router.put('/change-password', identifier, authController.changePassword);
router.patch('/forgot-password',authController.sendForgotPasswordCode);
router.patch('/verify-forgot-password-code',authController.verifyForgotPasswordCode);

router.get('/count', identifier, authController.getCounts);

module.exports = router;