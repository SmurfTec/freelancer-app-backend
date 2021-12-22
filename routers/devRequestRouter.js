const express = require('express');
const devRequestController = require('../controllers/devRequestController');
const offersController = require('../controllers/offersController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const offersRouter = require('../routers/offersRouter');
const { validateCategories } = require('../middlewares/validateCategories');
const upload = require('../middlewares/multerUpload');

const router = express.Router();

router
  .route('/')
  .get(devRequestController.getAllDevRequests)
  .post(
    protect,
    restrictTo('buyer'),
    upload.single('image'),
    validateCategories,
    devRequestController.createDevRequest
  );

router.get(
  '/me',
  protect,
  restrictTo('buyer'),
  devRequestController.getMyDevRequests
);

router
  .route('/:id')
  .get(devRequestController.getDevRequest)
  .delete(protect, restrictTo('buyer'), devRequestController.deleteDevRequest);

router
  .route('/manageoffer/:id')
  .patch(protect, restrictTo('buyer'), offersController.manageOffer);

router.use('/:devRequestId/offers', offersRouter);

module.exports = router;
