const Category = require('../models/Category');
const DevRequest = require('../models/DevRequest');
const SubCategory = require('../models/SubCategory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//* only buyer
exports.createDevRequest = catchAsync(async (req, res, next) => {
  const devrequest = await DevRequest.create({
    ...req.body,
    category: req.body.category,
    subCategory: req.body.subCategory,
    user: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    devrequest,
  });
});

//* only seller

exports.getAllDevRequests = catchAsync(async (req, res, next) => {
  let query = DevRequest.find();
  if (req.query.status) query.find({ status: req.query.status });
  query
    .populate({
      path: 'user',
      select: 'name email photo role',
    })
    .populate('category')
    .populate('subCategory');

  const devRequests = await query;
  // .populate({
  //   path: 'offers',
  //   select: '',
  // });

  res.status(200).json({
    status: 'success',
    results: devRequests.length,
    devRequests,
  });
});

//* only buyer
exports.getMyDevRequests = catchAsync(async (req, res, next) => {
  let devRequests = await DevRequest.find({ user: req.user._id })
    .populate({
      path: 'user',
      select: 'name email photo role',
    })
    .populate('category')
    .populate('subCategory');

  res.status(200).json({
    status: 'success',
    results: devRequests.length,
    devRequests,
  });
});

//* only a person who created/buyer can get single devRequest

exports.getDevRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const devrequest = await DevRequest.findById({
    user: req.user._id,
    _id: id,
  })
    // const devrequest = await DevRequest.findById({ _id: id })
    .populate({
      path: 'user',
      select: 'name email photo role',
    })
    .populate('category')
    .populate('subCategory');

  if (!devrequest)
    return next(new AppError(`Can't find devrequest for id ${id}`, 404));

  //* return all the offer created on single devrequest

  res.status(200).json({
    status: 'success',
    devrequest,
  });
});

exports.deleteDevRequest = catchAsync(async (req, res, next) => {
  console.log(`req.user.id`, req.user.id);
  let devrequest;
  if (req.user.role === 'admin')
    devrequest = await DevRequest.findByIdAndDelete(req.params.id);
  else {
    devrequest = await DevRequest.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
  }

  if (!devrequest)
    return next(
      new AppError(`Can't find devrequest for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    devrequest,
  });
});
