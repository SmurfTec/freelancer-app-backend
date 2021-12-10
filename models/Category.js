const mongoose = require('mongoose');
const validator = require('validator');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, 'must be less than or equal to 20'],
    },
    subCategories: [{ type: mongoose.Schema.Objectid, ref: 'SubCategory' }],
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
