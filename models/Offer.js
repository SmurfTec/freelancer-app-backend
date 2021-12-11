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
      minlength: [20, 'must NOT be less than or equal to 20'],
    },
    devRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DevRequest',
    },
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
    revisions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

offerSchema.index({ user: 1, devRequest: 1 }, { unique: true });

offerSchema.pre(
  /^find/,
  function (next) {
    // this points to current query
    this.populate({
      path: 'user',
      select: 'name email photo role',
    });

    next();
  },
  { timestamps: true }
);

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;