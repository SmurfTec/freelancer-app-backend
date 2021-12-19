const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    status: 'success',
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const Order = await Order.findById(req.params.id);

  if (!Order)
    return next(
      new AppError(`Can't find Order for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    Order,
  });
});

exports.manageorder = catchAsync(async (req, res, next) => {
  const Order = await Order.findById(req.params.id);

  if (!Order)
    return next(
      new AppError(`Can't find Order for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    Order,
  });
});
