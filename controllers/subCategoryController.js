const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.checkCategoryId = catchAsync(async (req, res, next) => {
  if (!req.params.categoryId)
    return next(
      new AppError('Provide Category Id with request', 400)
    );
  next();
});

exports.getAllSubCategories = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId).populate(
    'subCategories'
  );
  if (!category)
    return next(
      new AppError(`No Category Found against id ${categoryId}`, 404)
    );

  res.status(200).json({
    status: 'success',
    subcategories: category.subCategories,
  });
});

exports.addNewSubCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId).populate(
    'subCategories'
  );
  if (!category)
    return next(
      new AppError(`No Category Found against id ${categoryId}`, 404)
    );

  const subCategory = await SubCategory.create(req.body);
  category.subCategories.push(subCategory._id);
  await category.save();
  await Category.populate(category, 'subCategories');

  res.status(201).json({
    status: 'success',
    subCategory,
    category,
  });
});

exports.getSubCategory = catchAsync(async (req, res, next) => {
  const subcategory = await SubCategory.findById(req.params.id);

  if (!subcategory)
    return next(
      new AppError(
        `Can't find subcategory for id ${req.params.id},404`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    subcategory,
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const subcategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subcategory)
    return next(
      new AppError(
        `Can't find subcategory for id ${req.params.id}`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    subcategory,
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const subcategory = await SubCategory.findByIdAndDelete(
    req.params.id
  );

  if (!subcategory)
    return next(
      new AppError(
        `Can't find subcategory for id ${req.params.id}`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    subcategory,
  });
});
