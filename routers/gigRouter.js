const express = require('express');

const gigController = require('../controllers/gigController');
const isVerified = require('../middlewares/isVerified');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const { validateCategories } = require('../middlewares/validateCategories');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/mygigs', gigController.myGigs);

router.route('/').get(gigController.getAllGigs).post(
  restrictTo('seller'), //* only seller can create a gig
  isVerified,
  validateCategories,
  gigController.createGig
);

router
  .route('/:id')
  .get(gigController.getGig)
  .patch(gigController.updateGig)
  .delete(gigController.deleteGig);

module.exports = router;
