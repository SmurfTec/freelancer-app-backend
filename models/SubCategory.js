const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
