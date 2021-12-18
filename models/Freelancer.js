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
  // only check when user is a seller
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  activationLink: String,
  // select: false, // TODO uncomment it late
});

const freelancerModel = User.discriminator(
  'Freelancer',
  freelancerSchema
);

module.exports = freelancerModel;
