const express = require('express');
const orderController = require('../controllers/orderController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.use(protect);

router.route('/').get(orderController.getAllOrders);

router.route('/me').get(orderController.getMyOrders);

router.route('/:id').get(orderController.getOrder);

router
  .route('/deliverorder/:id')
  .patch(restrictTo('seller'), orderController.deliverOrder);

router
  .route('/manageorder/:id')
  .patch(restrictTo('buyer'), orderController.manageOrder);

module.exports = router;
