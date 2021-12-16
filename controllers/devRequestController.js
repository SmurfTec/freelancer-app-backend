const Category = require('../models/Category');
const DevRequest = require('../models/DevRequest');
const SubCategory = require('../models/SubCategory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMyData = catchAsync(async (req, res, next) => {
  req.dataFilter = {
    user: req.user._id,
  };
  next();
});

exports.getAllDevRequests = catchAsync(async (req, res, next) => {
  let query = DevRequest.find(req.dataFilter || {});
  if (req.query.status) query.find({ status: req.query.status });

  query
    .populate({
      path: 'user',
      select: 'name email photo role',
    })
    .populate('category')
    .populate('subCategory');

  const devrequests = await query;
  // .populate({
  //   path: 'offers',
  //   select: '',
  // });

  res.status(200).json({
    status: 'success',
    results: devrequests.length,
    devrequests,
  });
});

exports.addNewDevRequest = catchAsync(async (req, res, next) => {
  const { description, budget, expectedDays, categoryId, subCategoryId } =
    req.body;

  const devrequest = await DevRequest.create({
    user: req.user._id,
    description,
    budget,
    expectedDays,
    category: categoryId,
    subCategory: subCategoryId,
  });

  res.status(201).json({
    status: 'success',
    devrequest,
  });
});

exports.getDevRequest = catchAsync(async (req, res, next) => {
  const devrequest = await DevRequest.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email photo role',
    })
    .populate('category')
    .populate('subCategory');

  if (!devrequest)
    return next(
      new AppError(`Can't find devrequest for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    devrequest,
  });
});

exports.updateDevRequest = catchAsync(async (req, res, next) => {
  const devrequest = await DevRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!devrequest)
    return next(
      new AppError(`Can't find devrequest for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    devrequest,
  });
});

exports.changeStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new AppError(`Provide Status with Request `, 400));

  const devrequest = await DevRequest.findByIdAndUpdate(
    req.params.id,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!devrequest)
    return next(
      new AppError(`Can't find devrequest for id ${req.params.id}`, 404)
    );

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
