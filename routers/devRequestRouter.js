const express = require('express');

const devRequestController = require('../controllers/devRequestController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const offersRouter = require('../routers/offersRouter');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(devRequestController.getAllDevRequests)
  .post(restrictTo('buyer'), devRequestController.addNewDevRequest);

router.get(
  '/me',
  restrictTo('buyer', 'seller'),
  devRequestController.getMyData,
  devRequestController.getAllDevRequests
);

router.patch(
  '/status/:id',
  restrictTo('admin'),
  devRequestController.changeStatus
);

router
  .route('/:id')
  .get(devRequestController.getDevRequest)
  .patch(restrictTo('buyer'), devRequestController.updateDevRequest)
  .delete(devRequestController.deleteDevRequest);

router.use('/:devRequestId/offers', offersRouter);

module.exports = router;
