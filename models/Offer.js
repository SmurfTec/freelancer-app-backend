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
      minlength: [50, 'must NOT be less than or equal to 50'],
    },
    expectedDays: Number,
    revisions: Number,
    price: Number,
  },
  { timestamps: true }
);

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
