const mongoose = require('mongoose');
const validator = require('validator');

const DevRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
  },
  description: {
    type: String,
    required: [true, 'A Development Request Must have a Description'],
    minlength: [30, 'Description must be at least 30 characters'],
  },
  budget: {
    type: Number,
  },
  expectedDays: {
    type: Number,
  },
  images: [
    {
      _id: String,
      url: String,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'archieved'],
    default: 'pending',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  images: [String],
  tags: [String],
  offers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Offer',
    },
  ],
});

DevRequestSchema.pre(
  /^find/,
  function (next) {
    // this points to current query
    this.populate({
      path: 'user',
      select: 'name email photo role',
    })
      .populate({
        path: 'offers',
      })
      .populate('category')
      .populate('subCategory');
    next();
  },
  { timestamps: true }
);

const DevRequest = mongoose.model('DevRequest', DevRequestSchema);
module.exports = DevRequest;
