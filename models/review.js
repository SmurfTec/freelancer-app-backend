const mongoose = require('mongoose');
const validator = require('validator');
const Gig = require('./Gig');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'must be greater than 1'], //   validator
      max: [5, 'must be smaller than 5 '], //  validator
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Freelancer',
      required: [true, 'Review must belong to a Freelancer'],
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Review must given to an Order'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

reviewSchema.index({ buyer: 1, order: 1 }, { unique: true });

reviewSchema.statics.cal_averageRatings = async function (sellerId) {
  // id for which the current review belong to
  // using aregation pipeline
  const stats = await this.aggregate([
    {
      $match: { seller: sellerId },
    },
    {
      $group: {
        _id: '$seller', // group by seller  seller field is defiend in current doc
        nRating: { $sum: 1 }, // add one for each rating e.g  5 review/ratings =  5 no of review/ratings
        avgRating: { $avg: '$rating' }, //  no of the field in current doc
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await Gig.findByIdAndUpdate(sellerId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Gig.findByIdAndUpdate(sellerId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//  each time new review is created calculate/update the nRating,avdRating
reviewSchema.post('save', function () {
  this.constructor.cal_averageRatings(this.seller);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
