const DevRequest = require('../models/DevRequest');
const Gig = require('../models/Gig');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setDevRequestId = catchAsync(async (req, res, next) => {
  const { devRequestId } = req.params;

  if (!devRequestId)
    return next(
      new AppError(`Provide Dev Request id with request for its offer`)
    );

  req.dataFilter = {
    devRequest: devRequestId,
  };

  next();
});

exports.getMyOffers = catchAsync(async (req, res, next) => {
  const offers = await Offer.find({
    user: req.user._id,
  }).populate({
    path: 'devRequest',
  });

  res.status(200).json({
    status: 'success',
    results: offers.length,
    offers,
  });
});

exports.getAllOffers = catchAsync(async (req, res, next) => {
  const { devRequestId } = req.params;
  console.log(`req.dataFilter`, req.dataFilter);
  console.log(`req.user._id`, req.user._id);

  // ! Only owner can view offers against his devReq's offers
  const devRequest = await DevRequest.findOne({
    _id: devRequestId,
    user: req.user._id,
  });

  if (!devRequest) {
    // ! Send the user his offer on this dev Request
    const userOffer = await Offer.findOne({
      devRequest: devRequestId,
      user: req.user._id,
    });

    return res.status(200).json({
      status: 'success',
      offers: [userOffer],
    });
  }

  const offers = await Offer.find(req.dataFilter || {});

  res.status(200).json({
    status: 'success',
    results: offers.length,
    offers,
  });
});

exports.addNewOffer = catchAsync(async (req, res, next) => {
  const { description, budget, expectedDays } = req.body;
  const { devRequestId } = req.params;

  console.log(`devRequestId`, devRequestId);
  const devRequest = await DevRequest.findOne({
    _id: devRequestId,
  });
  if (!devRequest)
    return next(
      new AppError(
        `No Approved Development Request Found against id ${devRequestId}`,
        404
      )
    );

  // * If already made offer on that devReq, then restrict him
  let alreadyOffer = await Offer.findOne({
    user: req.user._id,
    devRequest: devRequestId,
  });
  if (alreadyOffer)
    return next(
      new AppError(`YOu already made offer on that development Request`)
    );

  // * If Already 10 offer made , then restrict him
  const reqOffers = await Offer.find({
    devRequest: devRequest._id,
  });
  if (reqOffers.length >= 10)
    return next(new AppError('Only 10 Bids can be made on a job', 400));

  const offer = await Offer.create({
    user: req.user._id,
    devRequest: devRequestId,
    description,
    budget,
    expectedDays,
  });

  await Offer.populate(offer, 'devRequest');
  await Offer.populate(offer, {
    path: 'user',
    // select: 'userName fullName about ratingsAverage isVerified country',
  });

  res.status(201).json({
    status: 'success',
    offer,
  });
});

exports.getOffer = catchAsync(async (req, res, next) => {
  const offers = await Offer.findById(req.params.id);

  if (!offers)
    return next(new AppError(`Can't find offer for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    offers,
  });
});

// accept or reject offer in chat by buyer only

exports.manageOffer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('hello');

  const offer = await Offer.findOne({ _id: id, status: 'pending' });
  if (!offer)
    return next(new AppError(`Can't find any pending offer for id ${id}`, 404));

  offer.status = status;
  await offer.save();

  let order;
  if (status === 'accepted') {
    const days = offer.expectedDays;
    let deadline = new Date();
    deadline.setHours(new Date().getHours() + 24 * days);

    // start the order after accepting the offer

    order = await Order.create({
      buyer: req.user._id,
      seller: offer.user,
      offer: offer._id,
      deadline: deadline,
    });
  }

  res.status(200).json({
    status: 'success',
    offer,
    order,
  });
});
