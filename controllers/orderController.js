const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Gig = require('../models/Gig');
const Freelancer = require('../models/Freelancer');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

// * how to use $or operator
//  orders = await Order.find({
//    $or: [{ buyer: req.user._id }, { seller: req.user._id }],
//  });

exports.getMyOrders = catchAsync(async (req, res, next) => {
  // * If loggedUser is now buyer , then those order in which he is buyer
  let orders = [];
  if (req.user.role === 'buyer')
    query = Order.find({
      buyer: req.user._id,
    });
  else
    query = Order.find({
      seller: req.user._id,
    });

  orders = await query
    .sort('-deadline -createdAt')
    .populate('offer')
    .populate('buyer', 'fullName photo ')
    .populate('seller', 'fullName photo ');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('offer')
    .populate('buyer', 'fullName photo ')
    .populate('seller', 'fullName photo ');

  if (!order)
    return next(new AppError(`Can't find Order for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    order,
  });
});

//* submit Order only seller

exports.deliverOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    seller: req.user._id,
    _id: id,
  });

  console.log(`order`, order);
  console.log(`req.user._id`, req.user._id);

  if (!order)
    return next(new AppError(`Can't find Order for id ${req.params.id}`, 404));

  if (!req.body.submission)
    return next(new AppError(`Provide Submission with request`, 400));

  order.status = 'delivered';
  order.submission = req.body.submission;
  await order.save();

  await Order.populate(order, 'offer');

  await Order.populate(order, { path: 'buyer', select: 'fullName photo' });

  await Order.populate(order, {
    path: 'seller',
    select: 'fullName photo',
  });

  res.status(200).json({
    status: 'success',
    order,
  });
});

//* manage order only buyer

exports.manageOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, review, rating } = req.body;

  if (!status) return next(new AppError(`Provide Status with request`, 400));

  const order = await Order.findOne({
    buyer: req.user._id,
    _id: id,
  });

  console.log(`order`, order);

  if (!order)
    return next(new AppError(`Can't find Order for id ${req.params.id}`, 404));

  if (order.status !== 'delivered') {
    return next(
      new AppError(`Can't change status for order ${req.params.id}`, 400)
    );
  }

  order.status = status;
  await order.save();

  let orderReview;
  if (order.status === 'completed' && review) {
    await Order.populate(order, {
      path: 'offer',
    });

    console.log(`order.offer`, order.offer);

    //* create a review
    orderReview = await Review.create({
      review,
      rating,
      order: order._id,
      buyer: req.user._id,
    });

    //* and find a user and calculate average and quantity of all the gigs
    const seller = await Freelancer.findById(order.seller);
    console.log(`seller1`, seller);

    seller.ratingsQuantity =
      seller.ratingsQuantity === 0 ? 1 : seller.ratingsQuantity + 1;
    seller.ratingsAverage =
      seller.ratingsQuantity === 1
        ? rating
        : (seller.ratingsAverage + rating) / seller.ratingsQuantity;

    console.log(`seller2`, seller);

    await seller.save();
  }

  await Order.populate(order, 'offer');

  await Order.populate(order, { path: 'buyer', select: 'fullName photo' });

  await Order.populate(order, {
    path: 'seller',
    select: 'fullName photo',
  });

  res.status(200).json({
    status: 'success',
    order,
    review: orderReview,
  });
});
