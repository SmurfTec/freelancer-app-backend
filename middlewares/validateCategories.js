const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

exports.validateCategories = catchAsync(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.body;

  const category = await Category.findById(categoryId);
  if (!category)
    return next(
      new AppError(`No Category Found against id ${categoryId}`, 404)
    );

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory)
    return next(
      new AppError(`No Sub Category Found against id ${subCategoryId}`, 404)
    );

  next();
});
