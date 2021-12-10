const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // * seller will be order.offer.user
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer',
    },
    dueDate: Date,
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    // * Payments or maybe payment
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
