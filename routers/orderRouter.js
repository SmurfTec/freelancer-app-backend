const express = require('express');
const orderController = require('../controllers/orderController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.use(protect);

router.route('/').get(orderController.getAllOrders);

router.route('/me').get(orderController.getMyOrders);

router.route('/:id').get(orderController.getOrder);

// * User can switch to different role , so at that time he maybe seller
// * So no need to restrictTo
router.route('/deliverorder/:id').patch(orderController.deliverOrder);
router.route('/manageorder/:id').patch(orderController.manageOrder);

module.exports = router;
