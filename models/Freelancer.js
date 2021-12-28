const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./User');

const freelancerSchema = new mongoose.Schema({
  about: {
    type: String,
    trim: true,
    minlength: [20, 'must be greater than 20 characters'],
  },

  country: { type: String, trim: true },
  skills: [String],
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

  gigs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
    },
  ],

  passwordResetToken: String,
  passwordResetExpires: Date,
  activated: {
    type: Boolean,
    default: true, //TODO make it false in production
  },
  // only check when user is a seller
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  activationLink: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  // select: false, // TODO uncomment it late
});

const freelancerModel = User.discriminator('Freelancer', freelancerSchema);

module.exports = freelancerModel;
