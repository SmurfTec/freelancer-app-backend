const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [15, 'must NOT be less than or equal to 15'],
    },
    // only in devRequest
    devRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DevRequest',
    },
    // gig: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Gig',
    // },
    budget: {
      type: Number,
      required: [true, 'A Development Request Must have a Budget'],
      validate: {
        validator: function (el) {
          return el >= 5;
        },
        message: `Budget can't be less than 5$`,
      },
    },
    expectedDays: {
      type: Number,
      required: [true, 'A Development Request Must have Expected Days'],
      validate: {
        validator: function (el) {
          return el >= 1;
        },
        message: `Expected Days can't be less than 1 day`,
      },
    },
    // only in chat
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

offerSchema.pre(/^find/, function (next) {
  // this points to current query
  this.sort('-createdAt').populate({
    path: 'user',
    select: 'fullName email photo role',
  });

  next();
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
