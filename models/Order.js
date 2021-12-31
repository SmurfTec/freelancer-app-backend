const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    submission: String, // * a zip file
    deadline: Date, // * in order accepts , deadline = offer.expectedDays
    status: {
      type: String,
      enum: ['active', 'delivered', 'incomplete', 'completed'],
      default: 'active',
    },
    // * Payments or maybe payment
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
