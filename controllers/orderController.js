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

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    $or: [{ buyer: req.user._id }, { seller: req.user._id }],
  })
    .populate('offer')
    .populate('buyer', 'name photo ')
    .populate('seller', 'name photo ');

  res.status(200).json({
    status: 'success',
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('offer')
    .populate('buyer', 'name photo ')
    .populate('seller', 'name photo ');

  if (!order)
    return next(
      new AppError(`Can't find Order for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    order,
  });
});

//* submit Order only seller

exports.deliverOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById({
    seller: req.user._id,
    _id: id,
  });
  if (!order)
    return next(
      new AppError(`Can't find Order for id ${req.params.id}`, 404)
    );

  order.status = 'delivered';
  await order.save();

  res.status(200).json({
    status: 'success',
    order,
  });
});

//* manage order only buyer

exports.manageOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({
    buyer: req.user._id,
    _id: id,
  });

  if (!order)
    return next(
      new AppError(`Can't find Order for id ${req.params.id}`, 404)
    );

  if (order.status !== 'delivered') {
    return next(
      new AppError(
        `Can't change status for order ${req.params.id}`,
        400
      )
    );
  }

  if (order.status === 'completed') {
    //* create a review
    const review = await Review.create({});

    //* find a gig and calculate average and quantity

    //* and find a user and calculate average and quantity of all the gigs
  }
  // status can be notAccepted or completed
  order.status = status;
  await order.save();

  res.status(200).json({
    status: 'success',
    order,
  });
});
