const mongoose = require('mongoose');
const validator = require('validator');

const User = require('./User');

const freelancerSchema = new mongoose.Schema(
  {
    userName: String,
    about: {
      type: String,
      trim: true,
      minlength: [20, 'must be greater than 20 characters'],
    },
    country: String,
    activationLink: String,
    // select: false, // TODO uncomment it late

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
    skills: [String],
    gigs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
      },
    ],
    ratingsQuantity: Number,
    ratingsAverage: Number,
  },
  {
    toJSON: { virtuals: true }, // make virtual part of the output
    toObject: { virtuals: true },
  }
);

// virtual populate => it shows the review which are belong to a particular freelancer
freelancerSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'freelancer', //  reference of the current modal
  localField: '_id', //  current modal id
});

const freelancerModel = User.discriminator('Freelancer', freelancerSchema);

module.exports = freelancerModel;
