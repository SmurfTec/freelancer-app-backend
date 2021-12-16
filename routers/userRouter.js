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
  .patch(userController.getMe, userController.updateUser);

router.patch('/updatePassword', authController.updatePassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(restrictTo('admin'), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(restrictTo('admin'), userController.updateUser)
  .delete(restrictTo('admin'), userController.deleteUser);

module.exports = router;
