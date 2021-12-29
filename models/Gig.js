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
  },
  { timestamps: true }
);

gigSchema.pre(/^find/, function (next) {
  // this points to current query
  this.sort('-createdAt')
    .populate({ path: 'category', select: 'title' })
    .populate('subCategory')
    .populate({
      path: 'user',
      select:
        'fullName photo reviews ratingsAverage ratingsQuantity country createdAt about',
    });

  next();
});

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;
