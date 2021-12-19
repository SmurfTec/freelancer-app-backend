const express = require('express');

const offersController = require('../controllers/offersController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.use(protect);

//!  ?
router.get(
  '/me',

  offersController.getMyOffers
);

router.route('/:id').get(offersController.getOffer);

router
  .route('/')
  .get(
    restrictTo('buyer'),
    offersController.setDevRequestId,
    offersController.getAllOffers
  )
  .post(
    isVerified,
    restrictTo('seller'),
    offersController.setDevRequestId,
    offersController.addNewOffer
  );

module.exports = router;
