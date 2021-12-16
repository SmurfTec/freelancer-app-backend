const Gig = require('../models/Gig');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Freelancer = require('../models/Freelancer');

exports.getAllGigs = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find();

  res.status(200).json({
    status: 'success',
    gigs,
  });
});

exports.addNewGig = catchAsync(async (req, res, next) => {
  const { packages } = req.body;
  if (packages.length > 3)
    return next(new AppError(`Packages Must be exceed 3`, 400));

  // * User can't add more than 5 gigs
  const user = await Freelancer.findById(req.user._id);
  console.log(`user.gigs`, user.gigs);
  if (user.gigs.length >= 5)
    return next(new AppError(`You can add maximum 5 gigs`, 403));

  const gig = await Gig.create({ ...req.body, user: req.user._id });
  user.gigs = [...user.gigs, gig._id];
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    gig,
    user,
  });
});

exports.getGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig)
    return next(new AppError(`Can't find gig for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    gig,
  });
});

exports.updateGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findOneAndUpdate(
    {
      user: req.user._id,
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!gig)
    return next(new AppError(`Can't find gig for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    gig,
  });
});

exports.changeStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new AppError(`Provide Status with Request `, 400));

  const gig = await Gig.findByIdAndUpdate(
    req.params.id,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!gig)
    return next(new AppError(`Can't find gig for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    gig,
  });
});

exports.deleteGig = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let gig;
  if (req.user.role === 'admin') {
    gig = await Gig.findByIdAndDelete({
      _id: id,
    });
    if (!gig) return next(new AppError(`Can't find gig for id ${id}`, 404));
  } else {
    gig = await Gig.findByIdAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!gig) return next(new AppError(`Can't find gig for id ${id}`, 404));
    const user = await Freelancer.findById(gig.user);
    user.gigs = user.gigs.filter((el) => el.toString() !== id);
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    gig,
  });
});
