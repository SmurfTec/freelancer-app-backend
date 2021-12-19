const mongoose = require('mongoose');
const validator = require('validator');

const DevRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    description: {
      type: String,
      required: [
        true,
        'A Development Request Must have a Description',
      ],
      minlength: [20, 'Description must be at least 20 characters'],
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
      required: [
        true,
        'A Development Request Must have Expected Days',
      ],
      validate: {
        validator: function (el) {
          return el >= 1;
        },
        message: `Expected Days can't be less than 1 day`,
      },
    },
    files: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [
        true,
        'A Development Request Must belong to a category`',
      ],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: [
        true,
        'A Development Request Must belong to a subCategory`',
      ],
    },
  },
  { timestamps: true }
);

DevRequestSchema.pre(/^find/, function (next) {
  this.sort('-createdAt')
  

  next();
});

const DevRequest = mongoose.model('DevRequest', DevRequestSchema);
module.exports = DevRequest;
