const express = require('express');
const devRequestController = require('../controllers/devRequestController');
const offersController = require('../controllers/offersController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const offersRouter = require('../routers/offersRouter');
const {
  validateCategories,
} = require('../middlewares/validateCategories');

const router = express.Router();
router.use(protect);

router
  .route('/')
  .get(restrictTo('seller'), devRequestController.getAllDevRequests)
  .post(
    restrictTo('buyer'),
    validateCategories,
    devRequestController.createDevRequest
  );

router.get(
  '/me',
  restrictTo('buyer'),
  devRequestController.getMyDevRequests
);

router
  .route('/:id')
  .get(restrictTo('buyer'), devRequestController.getDevRequest)
  .delete(restrictTo('buyer'), devRequestController.deleteDevRequest);

router
  .route('/manageoffer/:id')
  .get(restrictTo('buyer'), offersController.manageOffer);

router.use('/:devRequestId/offers', offersRouter);

module.exports = router;
