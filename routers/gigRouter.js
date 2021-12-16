const express = require('express');

const gigController = require('../controllers/gigController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const { validateCategories } = require('../middlewares/validateCategories');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(
    // gigController.setDevRequestId,
    gigController.getAllGigs
  )
  .post(
    restrictTo('seller'),
    isVerified,
    validateCategories,
    gigController.addNewGig
  );

router.patch('/status/:id', restrictTo('admin'), gigController.changeStatus);

router
  .route('/:id')
  .get(gigController.getGig)
  // .patch(gigController.updateOffer)
  // ! either we validate that dont updateOffer if it is accepter or we dont allow user to update offer
  .delete(gigController.deleteGig);

module.exports = router;
