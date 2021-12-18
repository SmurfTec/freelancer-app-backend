const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.use(protect); //  protect all router which are comming after this middleware

router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.setMe, userController.updateMe);

router.patch('/updatePassword', authController.updatePassword);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(restrictTo('admin'), userController.deleteUser);

router
  .route('/verify/:id')
  .patch(restrictTo('admin'), userController.manageVerification);

module.exports = router;
