const express = require('express');
const orderController = require('../controllers/orderController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.use(protect);

router.route('/').get(orderController.getAllOrders);

router.route('/:id').get(orderController.getOrder);

router.use('/manageorder/:id', orderController.manageorder);

module.exports = router;
