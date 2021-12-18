const DevRequest = require('../models/DevRequest');
const Gig = require('../models/Gig');
const Offer = require('../models/Offer');
const Offers = require('../models/Offer');
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

exports.getAllOffers = catchAsync(async (req, res, next) => {
  const { devRequestId } = req.params;
  console.log(`req.dataFilter`, req.dataFilter);
  console.log(`req.user._id`, req.user._id);

  // ! Only owner can view offers against his devReq's offers
  const devRequest = await DevRequest.findOne({
    _id: devRequestId,
    user: req.user._id,
  });

  if (!devRequest)
    return next(
      new AppError(`Can't find Development Request with id ${devRequestId}`)
    );

  const offers = await Offers.find(req.dataFilter || {});

  res.status(200).json({
    status: 'success',
    results: offers.length,
    offers,
  });
});

exports.addNewOffer = catchAsync(async (req, res, next) => {
  const { description, budget, expectedDays, gigId } = req.body;
  const { devRequestId } = req.params;

  console.log(`devRequestId`, devRequestId);
  const devRequest = await DevRequest.findOne({
    _id: devRequestId,
    status: 'approved',
  });
  if (!devRequest)
    return next(
      new AppError(
        `No Approved Development Request Found against id ${devRequestId}`,
        404
      )
    );

  const gig = await Gig.findOne({
    _id: gigId,
    status: 'approved',
  });
  if (!gig)
    return next(
      new AppError(`No Approved Gig  Found against id ${gigId}`, 404)
    );

  const offer = await Offers.create({
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
  const offers = await Offers.findById(req.params.id);

  if (!offers)
    return next(new AppError(`Can't find offer for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    offers,
  });
});

exports.updateOffer = catchAsync(async (req, res, next) => {
  const offers = await Offers.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!offers)
    return next(new AppError(`Can't find offer for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    offers,
  });
});

exports.deleteOffer = catchAsync(async (req, res, next) => {
  let offer;
  if (req.user.role === 'admin')
    offer = await Offers.findByIdAndDelete(req.params.id);
  else
    offer = await Offers.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

  if (!offer)
    return next(new AppError(`Can't find offer for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    offer,
  });
});
