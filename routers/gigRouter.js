const express = require('express');

const gigController = require('../controllers/gigController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const { validateCategories } = require('../middlewares/validateCategories');

const router = express.Router({ mergeParams: true });

router.get('/mygigs', protect, gigController.myGigs);

router.route('/').get(gigController.getAllGigs).post(
  protect,
  restrictTo('seller'), //* only seller can create a gig
  isVerified,
  validateCategories,
  gigController.createGig
);

router
  .route('/:id')
  .get(gigController.getGig)
  .patch(protect, gigController.updateGig)
  .delete(protect, gigController.deleteGig);

module.exports = router;
