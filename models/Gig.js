const mongoose = require('mongoose');
const validator = require('validator');

const gigSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    title: {
      type: String,
      required: [true, 'Gig must have title '],
      maxlength: [40, 'must be less than or equal to 20'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [20, 'must NOT be less than or equal to 20'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    packages: [
      {
        name: {
          type: String,
          maxlength: [20, 'must be less than or equal to 20'],
        },
        description: {
          type: String,
          trim: true,
          minlength: [10, 'must NOT be less than or equal to 10'],
        },
        expectedDays: Number,
        price: Number,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    //* will be calculated when buyer create a new review on an order
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

gigSchema.pre(/^find/, function (next) {
  // this points to current query
  this.sort('-createdAt')
    .populate({ path: 'category', select: 'title' })
    .populate('subCategory');
  next();
});

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;
