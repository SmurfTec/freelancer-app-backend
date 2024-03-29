const express = require('express');

const categoryController = require('../controllers/categoryController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const subCategoryRouter = require('../routers/subCategoryRouter');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(protect, restrictTo('admin'), categoryController.addNewCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(protect, restrictTo('admin'), categoryController.updateCategory)
  .delete(protect, restrictTo('admin'), categoryController.deleteCategory);

router.use('/:categoryId/subcategories', subCategoryRouter);
module.exports = router;
