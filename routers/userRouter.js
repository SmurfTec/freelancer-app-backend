const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/me')
  .get(protect, userController.getMe)
  .patch(protect, userController.setMe, userController.updateMe);

router.patch('/updatePassword', protect, authController.updatePassword);

router.route('/').get(protect, userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(restrictTo('admin'), protect, userController.deleteUser);

router
  .route('/verify/:id')
  .patch(restrictTo('admin'), protect, userController.manageVerification);

module.exports = router;
