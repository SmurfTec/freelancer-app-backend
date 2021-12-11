const Category = require('../models/Category');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().populate('subCategories');

  res.status(200).json({
    status: 'success',
    categories,
  });
});

exports.addNewCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    title: req.body.title,
  });

  res.status(201).json({
    status: 'success',
    category,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate(
    'subCategories'
  );

  if (!category)
    return next(
      new AppError(`Can't find category for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category)
    return next(
      new AppError(`Can't find category for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category)
    return next(
      new AppError(`Can't find category for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    category,
  });
});
