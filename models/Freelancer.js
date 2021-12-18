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
  ratingsQuantity: Number,
  ratingsAverage: Number,
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  activationLink: String,
  // select: false, // TODO uncomment it late
});

const freelancerModel = User.discriminator(
  'Freelancer',
  freelancerSchema
);

module.exports = freelancerModel;
