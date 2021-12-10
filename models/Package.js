const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package must have title '],
      maxlength: [20, 'must be less than or equal to 20'],
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
    services: [String],
  },
  { timestamps: true }
);

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
