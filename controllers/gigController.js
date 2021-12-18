const Gig = require('../models/Gig');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Freelancer = require('../models/Freelancer');

exports.createGig = catchAsync(async (req, res, next) => {
  const { packages } = req.body;

  if (packages.length > 3)
    return next(new AppError(`Packages Must be exceed 3`, 400));

  // * User can't add more than 5 gigs
  const user = await Freelancer.findById(req.user._id);
  console.log(`user.gigs`, user.gigs);

  if (user.gigs.length >= 5)
    return next(new AppError(`You can add maximum 5 gigs`, 400));

  const gig = await Gig.create({ ...req.body, user: req.user._id });

  // update gigs
  user.gigs = [...user.gigs, gig._id];
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    gig,
    user,
  });
});

exports.getAllGigs = catchAsync(async (req, res, next) => {
  let gigs;
  if (req.user.role === 'admin') {
    gigs = await Gig.find();
  } else {
    gigs = await Gig.find({ status: 'approved' });
  }

  res.status(200).json({
    status: 'success',
    length: gigs.length,
    gigs,
  });
});

exports.myGigs = catchAsync(async (req, res, next) => {
  let gigs = await Gig.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    length: gigs.length,
    gigs,
  });
});

exports.getGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig)
    return next(
      new AppError(`Can't find gig for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    gig,
  });
});

exports.updateGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!gig)
    return next(
      new AppError(
        `Can't find gig for id ${req.params.id} try again`,
        404
      )
    );
  res.status(200).json({
    status: 'success',
    gig,
  });
});

exports.deleteGig = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let gig = await Gig.findByIdAndDelete({
    _id: id,
    user: req.user._id,
  });
  if (!gig)
    return next(
      new AppError(`Can't find gig for id ${id} try again`, 404)
    );

  //* also remove gig from mygigs

  const user = await Freelancer.findById(gig.user);
  user.gigs = user.gigs.filter((el) => el.toString() !== id);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    gig,
  });
});

//* status (pending , approved , rejected)

exports.manageGigStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('i am here');
  if (!status)
    return next(new AppError(`Provide Status with Request `, 400));

  const gig = await Gig.findById(id);
  if (!gig)
    return next(
      new AppError(`Can't find gig for id ${req.params.id}`, 404)
    );

  gig.status = status;
  await gig.save();

  res.status(200).json({
    status: 'success',
    gig,
  });
});
