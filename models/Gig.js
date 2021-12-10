const mongoose = require('mongoose');
const validator = require('validator');

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gig must have title '],
      maxlength: [20, 'must be less than or equal to 20'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [20, 'must NOT be less than or equal to 20'],
    },
    tags: [String],
    images: [String],
    services: [String],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    packages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
  },
  { timestamps: true }
);

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;
