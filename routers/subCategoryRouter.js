const express = require('express');

const subcategoryController = require('../controllers/subCategoryController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    subcategoryController.checkCategoryId,
    subcategoryController.getAllSubCategories
  )
  .post(
    subcategoryController.checkCategoryId,
    subcategoryController.addNewSubCategory
  );

router
  .route('/:id')
  .get(subcategoryController.getSubCategory)
  .patch(subcategoryController.updateSubCategory)
  .delete(subcategoryController.deleteSubCategory);

module.exports = router;
