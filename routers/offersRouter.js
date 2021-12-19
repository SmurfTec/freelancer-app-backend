const express = require('express');

const offersController = require('../controllers/offersController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.use(protect);

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

//!  ?
router.get(
  '/me',
  (req, res, next) => {
    req.dataFilter = { user: req.user._id };
    next();
  },

  offersController.getAllOffers
);

router.route('/:id').get(offersController.getOffer);

module.exports = router;
