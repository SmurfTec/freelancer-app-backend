const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

exports.validateCategories = catchAsync(async (req, res, next) => {
  const { category, subCategory } = req.body;

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc)
    return next(new AppError(`No Category Found against id ${category}`, 404));

  const subCategoryDoc = await SubCategory.findById(subCategory);
  if (!subCategoryDoc)
    return next(
      new AppError(`No Sub Category Found against id ${subCategory}`, 404)
    );

  next();
});
