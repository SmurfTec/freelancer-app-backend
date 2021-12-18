const express = require('express');

const offersController = require('../controllers/offersController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(offersController.setDevRequestId, offersController.getAllOffers)
  .post(
    isVerified,
    restrictTo('seller'),
    offersController.setDevRequestId,
    offersController.addNewOffer
  );

router.get(
  '/me',
  (req, res, next) => {
    req.dataFilter = { user: req.user._id };
    next();
  },
  offersController.getAllOffers
);

router
  .route('/:id')
  .get(offersController.getOffer)
  // .patch(offersController.updateOffer)
  // ! either we validate that dont updateOffer if it is accepter or we dont allow user to update offer
  .delete(offersController.deleteOffer);

module.exports = router;
